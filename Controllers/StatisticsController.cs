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
                            .Include(t => t.FailedCards)
                            .AsNoTracking()
                            .Where(t => t.Deck.OwnerId == user.Id)
                            .ToListAsync();

            var totalCards = 0;
            var totalCardsToday = 0;
            var failedCards = 0;
            var failedCardsToday = 0;

            foreach (var test in tests)
            {
                totalCards += test.TotalCards;
                failedCards += test.FailedCards.Count;

                if (test.DateTime.Date == DateTime.Now.Date)
                {
                    totalCardsToday += test.TotalCards;
                    failedCardsToday += test.FailedCards.Count;
                }
            }

            return new
            {
                TotalCards = totalCards,
                FailedCards = failedCards,
                TotalCardsToday = totalCardsToday,
                FailedCardsToday = failedCardsToday
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
                            .Include(t => t.FailedCards)
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
                totalCards += test.TotalCards;
                failedCards += test.FailedCards.Count();

                if (test.DateTime.Date == now.Date)
                {
                    totalCardsToday += test.TotalCards;
                    failedCardsToday += test.FailedCards.Count();
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
                    tests.Where(t => t.DateTime.Date == DateTime.Now.Date).Average(t => t.Score)
            };
        }
    }
}