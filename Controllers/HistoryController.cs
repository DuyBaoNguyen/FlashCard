using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.ApiModels;
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
    public class HistoryController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public HistoryController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }
        
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TestApiModel>>> GetHistory()
        {
            var user = await UserService.GetUser(userManager, User);
            var deckIds = await dbContext.Decks
                              .Where(d => d.OwnerId == user.Id)
                              .AsNoTracking()
                              .Select(d => d.Id)
                              .ToArrayAsync<int>();
            var tests = dbContext.Tests
                            .Include(t => t.Deck)
                            .Include(t => t.TestedCards)
                                .ThenInclude(tc => tc.Card)
                            .Where(t => deckIds.Contains(t.DeckId))
                            .AsNoTracking()
                            .OrderByDescending(t => t.DateTime)
                            .Take(5);
            var testModels = new List<TestApiModel>();

            foreach (var test in tests)
            {
                testModels.Add(new TestApiModel(test));
            }

            return testModels;
        }
    }
}