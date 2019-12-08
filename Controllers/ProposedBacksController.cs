using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Data;
using FlashCard.Models;
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
    public class ProposedBacksController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public ProposedBacksController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }
        
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ApproveBack(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }

            var back = await dbContext.Backs.FirstOrDefaultAsync(b => b.Id == id);

            if (back == null)
            {
                return NotFound();
            }
            if (!back.Public || back.Approved)
            {
                return Forbid();
            }

            back.Approved = true;
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBack(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }

            var back = await dbContext.Backs.FirstOrDefaultAsync(b => b.Id == id);

            if (back == null)
            {
                return NotFound();
            }
            if (!back.Public || back.Approved)
            {
                return Forbid();
            }

            dbContext.Backs.Remove(back);
            await dbContext.SaveChangesAsync();

            // Remove card if card has no back and no one owns it
            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                            .FirstOrDefaultAsync(c => c.Id == back.CardId);

            if (card.Backs.Where(b => b.OwnerId == user.Id).Count() == 0)
            {
                dbContext.CardOwners.Remove(dbContext.CardOwners.FirstOrDefault(co =>
                    co.CardId == card.Id && co.UserId == user.Id));
                dbContext.Proposals.RemoveRange(dbContext.Proposals.Where(p => p.CardId == card.Id && !p.Approved));
            }
            if (card.Backs.Count == 0)
            {
                dbContext.Cards.Remove(card);
            }

            await dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}