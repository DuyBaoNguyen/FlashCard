using System;
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
    public class StatisticsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public StatisticsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<object> GetAll()
        {
            var user = await UserService.GetUser(userManager, User);
            var tests = await dbContext.Tests
                            .Include(t => t.Deck)
                            .Include(t => t.TestedCards)
                            .AsNoTracking()
                            .Where(t => t.Deck.OwnerId == user.Id)
                            .ToListAsync();

            var now = DateTime.Now;
            var testsToday = tests.Where(t => t.DateTime.Date == now.Date);

            return new
            {
                TotalCards = tests.Sum(t => t.TestedCards.Count),
                FailedCards = tests.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
                GradePointAverage = tests.Count == 0 ? 0 : tests.Average(t => t.Score),
                TotalCardsToday = testsToday.Sum(t => t.TestedCards.Count),
                FailedCardsToday = testsToday.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
                gradePointAverageToday = testsToday.Count() == 0 ? 0 : testsToday.Average(t => t.Score)
            };
        }

        [HttpGet("{deckId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<object>> GetByDeckId(int deckId)
        {
            var user = await UserService.GetUser(userManager, User);
            var deck = await dbContext.Decks.FindAsync(deckId);

            if (deck == null)
            {
                return NotFound();
            }

            if (await userManager.IsInRoleAsync(user, Roles.User) && deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var tests = await dbContext.Tests
                            .Include(t => t.Deck)
                            .Include(t => t.TestedCards)
                            .AsNoTracking()
                            .Where(t => t.DeckId == deckId)
                            .ToListAsync();

            var now = DateTime.Now;
            var testsToday = tests.Where(t => t.DateTime.Date == now.Date);

            return new
            {
                TotalCards = tests.Sum(t => t.TestedCards.Count),
                FailedCards = tests.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
                GradePointAverage = tests.Count == 0 ? 0 : tests.Average(t => t.Score),
                TotalCardsToday = testsToday.Sum(t => t.TestedCards.Count),
                FailedCardsToday = testsToday.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
                gradePointAverageToday = testsToday.Count() == 0 ? 0 : testsToday.Average(t => t.Score)
            };
        }
    }
}