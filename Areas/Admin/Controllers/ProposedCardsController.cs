using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Areas.Admin.Controllers
{
    [Authorize]
    [Route("api/admin/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    public class ProposedCardsController : ControllerBase
    {
        private readonly IRepositoryWrapper repository;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IImageService imageService;

        public ProposedCardsController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
            IImageService imageService)
        {
            this.repository = repository;
            this.userManager = userManager;
            this.imageService = imageService;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(403)]
        public async Task<ActionResult<IEnumerable<ProposedCardDto>>> GetAllProposedCards()
        {
            var user = await userManager.GetUser(User);
            var userIsAdmin = await userManager.CheckAdminRole(user);

            if (!userIsAdmin)
            {
                return Forbid();
            }

            var proposedCards = await repository.Card
                .QueryByBeingNotApproved(user.Id)
                .AsNoTracking()
                .MapToProposedCardDto(imageService.BackImageBaseUrl)
                .ToListAsync();

            return proposedCards;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(403)]
        public async Task<ActionResult<ProposedCardDto>> GetProposedCardById(int id)
        {
            var user = await userManager.GetUser(User);
            var userIsAdmin = await userManager.CheckAdminRole(user);

            if (!userIsAdmin)
            {
                return Forbid();
            }

            var proposedCard = await repository.Card
                .QueryByIdAndBeingNotApproved(user.Id, id)
                .AsNoTracking()
                .MapToProposedCardDto(imageService.BackImageBaseUrl)
                .FirstOrDefaultAsync();

            if (proposedCard == null)
            {
                return NotFound();
            }

            return proposedCard;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ConsiderProposeCard(int id, BoolValueRequestModel valueRqModel)
        {
            var user = await userManager.GetUser(User);
            var userIsAdmin = await userManager.CheckAdminRole(user);

            if (!userIsAdmin)
            {
                return Forbid();
            }

            var proposedCard = await repository.Card
               .QueryByIdIncludesBacks(user.Id, id)
               .FirstOrDefaultAsync();

            if (proposedCard == null)
            {
                return NotFound();
            }

            if (valueRqModel.Value)
            {
                proposedCard.Approved = true;
                foreach (var back in proposedCard.Backs)
                {
                    back.Approved = true;
                }
            }
            else
            {
                if (proposedCard.Backs.Any(b => b.Approved))
                {
                    repository.Back.DeleteRange(proposedCard.Backs.Where(b => b.Public != b.Approved));
                }
                else
                {
                    repository.Card.Delete(proposedCard);
                }
            }

            await repository.SaveChangesAsync();

            return NoContent();
        }
    }
}