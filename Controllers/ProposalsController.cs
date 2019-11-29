using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.ApiModels;
using FlashCard.Data;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class ProposalsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public ProposalsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet("cards")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<CardApiModel>>> GetAllProposedCards()
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            if (!userIsInAdminRole)
            {
                return Forbid();
            }

            var admin = await UserService.GetAdmin(dbContext);
            var proposedCards = dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Where(c => c.Backs.FirstOrDefault(b => b.Public && !b.Approved) != null);
            var cardModels = new List<CardApiModel>();
            
            foreach (var proposedCard in proposedCards)
            {
                cardModels.Add(new CardApiModel(proposedCard, admin));
            }

            return cardModels;
        }
        
        [HttpPost("cards")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ProposedCard([FromBody] CardRequestModel cardModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                            .FirstOrDefaultAsync(c => c.Front == cardModel.Front);

            if (card == null)
            {
                card = new Card()
                {
                    Front = cardModel.Front,
                    Backs = new List<Back>()
                };
                dbContext.Cards.Add(card);
            }

            var image = ImageService.GetImage(cardModel.Back.Image);
            var admin = await UserService.GetAdmin(dbContext);
            var userId = UserService.GetUserId(User);

            card.Backs.Add(new Back()
            {
                Type = cardModel.Back.Type,
                Meaning = cardModel.Back.Meaning,
                Example = cardModel.Back.Example,
                Image = image?.Data,
                ImageType = image?.Type,
                Public = true,
                LastModified = DateTime.Now,
                OwnerId = admin.Id,
                AuthorId = userId
            });

            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}