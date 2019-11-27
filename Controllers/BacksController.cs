using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
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
    public class BacksController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public BacksController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] BackRequestModel backmodel)
        {
            var back = await dbContext.Backs.FirstOrDefaultAsync(b => b.Id == id);

            if (back == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (back.OwnerId != user.Id)
            {
                return Forbid();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ImageService.Image image = ImageService.GetImage(backmodel.Image);

            back.Type = backmodel.Type;
            back.Meaning = backmodel.Meaning;
            back.Example = backmodel.Example;
            back.Image = image?.Data;
            back.ImageType = image?.Type;

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var back = await dbContext.Backs.FirstOrDefaultAsync(b => b.Id == id);

            if (back == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (back.OwnerId != user.Id)
            {
                return Forbid();
            }
            
            var derivedBacks = dbContext.Backs.Where(b => b.SourceId == back.Id);

            foreach (var derivedBack in derivedBacks)
            {
                derivedBack.SourceId = null;
            }

            dbContext.Backs.Remove(back);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}