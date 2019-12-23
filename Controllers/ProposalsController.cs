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
    public class ProposalsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public ProposalsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ApproveProposalForDeck(int id)
        {
            var proposal = await dbContext.Proposals.FirstOrDefaultAsync(p => p.Id == id);

            if (proposal == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }
            if (proposal.Approved)
            {
                return NoContent();
            }

            var cardAssignment = await dbContext.CardAssignments.FirstOrDefaultAsync(ca =>
                                     ca.CardId == proposal.CardId && ca.DeckId == proposal.DeckId);

            if (cardAssignment == null)
            {
                dbContext.CardAssignments.Add(new CardAssignment()
                {
                    CardId = proposal.CardId,
                    DeckId = proposal.DeckId
                });
            }

            proposal.Approved = true;
            var backs = dbContext.Backs.Where(b => b.CardId == proposal.CardId && b.OwnerId == user.Id && 
                            b.AuthorId == proposal.UserId && !b.Approved);
                                
            foreach (var back in backs)
            {
                back.Approved = true;
            }

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProposalFromDeck(int id)
        {
            var proposal = await dbContext.Proposals.FirstOrDefaultAsync(p => p.Id == id);

            if (proposal == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole && (proposal.UserId != user.Id || proposal.Approved))
            {
                return Forbid();
            }

            dbContext.Proposals.Remove(proposal);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}