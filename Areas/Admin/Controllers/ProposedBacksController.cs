using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Areas.Admin.Controllers
{
    [Authorize]
    [Route("api/admin/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    public class ProposedBacksController : ControllerBase
    {
        private readonly IRepositoryWrapper repository;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IImageService imageService;
        private readonly ILogger<ProposedBacksController> logger;

        public ProposedBacksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
            IImageService imageService, ILogger<ProposedBacksController> logger)
        {
            this.repository = repository;
            this.userManager = userManager;
            this.imageService = imageService;
            this.logger = logger;
        }

        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ConsiderProposedBacks(ProposedBacksRequestModel backsRqModel)
        {
            var user = await userManager.GetUser(User);
            var userIsAdmin = await userManager.CheckAdminRole(user);

            if (!userIsAdmin)
            {
                return Forbid();
            }

            if (backsRqModel.ProposedBacks.Length == 0)
            {
                ModelState.AddModelError("ProposedBacks", "The ProposedBacks field is required.");
                return BadRequest(ModelState);
            }

            var notApprovedBacks = await repository.Back
                .QueryByBeingNotApproved(user.Id, backsRqModel.ProposedBacks)
                .ToListAsync();
            if (notApprovedBacks.Count != backsRqModel.ProposedBacks.Length)
            {
                ModelState.AddModelError("ProposedBacks", "At least a back is not proposed back.");
                return BadRequest(ModelState);
            }

            if (backsRqModel.Approved)
            {
                foreach (var back in notApprovedBacks)
                {
                    back.Approved = true;
                }
            }
            else
            {
                repository.Back.DeleteRange(notApprovedBacks);
            }

            await repository.SaveChangesAsync();

            var card = await repository.Card
                .QueryByIdIncludesBacks(user.Id, notApprovedBacks[0].CardId)
                .FirstOrDefaultAsync();
            if (card == null)
            {
                return NoContent();
            }

            if (backsRqModel.Approved)
            {
                card.Approved = true;
            }
            else if (card.Backs.Count == 0)
            {
                repository.Card.Delete(card);
            }

            await repository.SaveChangesAsync();

            if (!backsRqModel.Approved)
            {
                foreach (var back in notApprovedBacks)
                {
                    if (back.Image != null)
                    {
                        if (!imageService.TryDeleteImage(back.Image, ImageType.Image))
                        {
                            logger.LogError("An error occurs when deleting the image with name {0}", back.Image);
                        }
                    }
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteProposedBack(int id)
        {
            var user = await userManager.GetUser(User);
            var userIsAdmin = await userManager.CheckAdminRole(user);

            if (!userIsAdmin)
            {
                return Forbid();
            }

            var notApprovedBack = await repository.Back
                .QueryByBeingNotApproved(user.Id, id)
                .FirstOrDefaultAsync();

            if (notApprovedBack == null)
            {
                return NotFound();
            }

            repository.Back.Delete(notApprovedBack);
            await repository.SaveChangesAsync();

            return NoContent();
        }
    }
}