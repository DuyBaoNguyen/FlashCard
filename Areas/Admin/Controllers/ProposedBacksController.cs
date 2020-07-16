using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Models;
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
    public class ProposedBacksController : ControllerBase
    {
        private readonly IRepositoryWrapper repository;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IImageService imageService;

        public ProposedBacksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
            IImageService imageService)
        {
            this.repository = repository;
            this.userManager = userManager;
            this.imageService = imageService;
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