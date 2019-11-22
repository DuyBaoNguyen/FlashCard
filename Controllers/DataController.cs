using System.Threading.Tasks;
using FlashCard.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashCard.Controllers
{
    [ApiController]
    [Route("api/data")]
    public class DataController : ControllerBase
    {
        private ApplicationDbContext dbContext;

        public DataController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDatabase()
        {
            dbContext.CardAssignments.RemoveRange(dbContext.CardAssignments);
            dbContext.CardOwners.RemoveRange(dbContext.CardOwners);
            dbContext.Proposals.RemoveRange(dbContext.Proposals);
            dbContext.Categories.RemoveRange(dbContext.Categories);
            dbContext.Decks.RemoveRange(dbContext.Decks);
            dbContext.Backs.RemoveRange(dbContext.Backs);
            dbContext.Cards.RemoveRange(dbContext.Cards);

            await dbContext.SaveChangesAsync();
            
            return Ok();
        }
    }
}