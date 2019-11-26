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

            int totalCards = 0;
            int totalCardsToday = 0;
            int failedCards = 0;
            int failedCardsToday = 0;
            var now = DateTime.Now;

            foreach (var test in tests)
            {
                totalCards += test.TestedCards.Count;
                failedCards += test.TestedCards.Where(t => t.Failed).Count();

                if (test.DateTime.Date == now.Date)
                {
                    totalCardsToday += test.TestedCards.Count;
                    failedCardsToday += test.TestedCards.Where(t => t.Failed).Count();
                }
            }

            return new
            {
                TotalCards = totalCards,
                FailedCards = failedCards,
                GradePointAverage = tests.Count == 0 ? 0 : tests.Average(t => t.Score),
                TotalCardsToday = totalCardsToday,
                FailedCardsToday = failedCardsToday,
                gradePointAverageToday = tests.Count == 0 ? 0 : 
                    tests.Where(t => t.DateTime.Date == now.Date).Average(t => t.Score)
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

            int totalCards = 0;
            int totalCardsToday = 0;
            int failedCards = 0;
            int failedCardsToday = 0;
            var now = DateTime.Now;

            foreach (var test in tests)
            {
                totalCards += test.TestedCards.Count;
                failedCards += test.TestedCards.Where(t => t.Failed).Count();

                if (test.DateTime.Date == now.Date)
                {
                    totalCardsToday += test.TestedCards.Count;
                    failedCardsToday += test.TestedCards.Where(t => t.Failed).Count();
                }
            }

            return new
            {
                TotalCards = totalCards,
                FailedCards = failedCards,
                GradePointAverage = tests.Count == 0 ? 0 : tests.Average(t => t.Score),
                TotalCardsToday = totalCardsToday,
                FailedCardsToday = failedCardsToday,
                gradePointAverageToday = tests.Count == 0 ? 0 : 
                    tests.Where(t => t.DateTime.Date == now.Date).Average(t => t.Score)
            };
        }
    }
}