using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.ApiModels;
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
    public class DecksController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public DecksController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<DeckApiModel>> GetAllByUser()
        {
            var user = await UserService.GetUser(userManager, User);
            var decks = dbContext.Decks
                            .Include(d => d.Category)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.Category)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.CardAssignments)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.Owner)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.Author)
                            .Include(d => d.Owner)
                            .Include(d => d.Author)
                            .Include(d => d.CardAssignments)
                            .Include(d => d.Proposals)
                                .ThenInclude(p => p.User)
                            .Where(d => d.OwnerId == user.Id)
                            .OrderBy(d => d.Name)
                            .AsNoTracking();

            var deckmodels = new List<DeckApiModel>();

            foreach (var deck in decks)
            {
                deckmodels.Add(new DeckApiModel(deck));
            }

            return deckmodels;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DeckApiModel>> Create([FromBody] DeckRequestModel deckModel)
        {
            var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == deckModel.Category.Id);

            if (category == null)
            {
                ModelState.AddModelError("Category.Id", "The Category Id is not provided or does not exist.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserService.GetUser(userManager, User);

            var deck = new Deck()
            {
                Name = deckModel.Name,
                Description = deckModel.Description,
                CreatedDate = DateTime.Now,
                LastModified = DateTime.Now,
                Category = category,
                Owner = user,
                Author = user
            };

            dbContext.Decks.Add(deck);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = deck.Id }, new DeckApiModel(deck));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DeckApiModel>> GetById(int id, int? pageSize, int pageIndex = 1)
        {
            var deck = await dbContext.Decks
                            .Include(d => d.Category)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.Category)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.CardAssignments)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.Owner)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.Author)
                            .Include(d => d.Owner)
                            .Include(d => d.Author)
                            .Include(d => d.CardAssignments)
                                .ThenInclude(ca => ca.Card)
                                    .ThenInclude(c => c.Backs)
                                        .ThenInclude(b => b.Author)
                            .Include(d => d.Proposals)
                                .ThenInclude(p => p.User)
                            .Include(d => d.Tests)
                                .ThenInclude(t => t.TestedCards)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            bool userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);
            bool ownerIsInUserRole = await userManager.IsInRoleAsync(deck.Owner, Roles.User);

            // Check the deck belongs with current user or is pucblic, if user is in administrator, it will be ignored
            if (userIsInUserRole && deck.OwnerId != user.Id && (ownerIsInUserRole || !deck.Public || !deck.Approved))
            {
                return Forbid();
            }

            // Paginate cards of deck if pageSize parameter is specified
            var cardAssignments = deck.CardAssignments;

            if (pageSize != null)
            {
                var numberPages = await GetNumberOfCardPages(id, pageSize.Value);

                if (pageIndex <= 0)
                {
                    pageIndex = 1;
                }
                else if (pageIndex > numberPages.Value)
                {
                    pageIndex = numberPages.Value;
                }

                if (pageSize.Value <= 0)
                {
                    pageSize = 1;
                }

                cardAssignments = cardAssignments.Skip((pageIndex - 1) * pageSize.Value).Take(pageSize.Value).ToArray();
            }

            // Get list of cards of the deck
            var cardmodels = new List<CardApiModel>();

            foreach (var cardAssignment in cardAssignments)
            {
                var cardmodel = new CardApiModel(cardAssignment.Card);
                var backs = cardAssignment.Card.Backs.Where(b => b.OwnerId == user.Id && !b.Public);

                foreach (var back in backs)
                {
                    cardmodel.Backs.Add(new BackApiModel(back));
                }

                cardmodels.Add(cardmodel);
            }
            cardmodels.Sort(CardComparison.CompareByFront);

            // Get statistics of the deck
            var now = DateTime.Now;
            var testsToday = deck.Tests.Where(t => t.DateTime.Date == now.Date);

            object statistics = new
            {
                TotalCards = deck.Tests.Sum(t => t.TestedCards.Count),
                FailedCards = deck.Tests.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
                GradePointAverage = deck.Tests.Count == 0 ? 0 : deck.Tests.Average(t => t.Score),
                TotalCardsToday = testsToday.Sum(t => t.TestedCards.Count),
                FailedCardsToday = testsToday.Sum(t => t.TestedCards.Where(tc => tc.Failed).Count()),
                gradePointAverageToday = testsToday.Count() == 0 ? 0 : testsToday.Average(t => t.Score)
            };

            var deckmodel = new DeckApiModel(deck);
            deckmodel.Statistics = statistics;
            deckmodel.Cards = cardmodels;

            return deckmodel;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] DeckRequestModel deckmodel)
        {
            var deck = await dbContext.Decks.FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var category = await dbContext.Categories.FindAsync(deckmodel.Category.Id);

            if (category == null)
            {
                ModelState.AddModelError("Category.Id", "The Category Id is not provided or does not exist.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            deck.Name = deckmodel.Name;
            deck.Description = deckmodel.Description;
            deck.Category = category;
            deck.Public = userIsInAdminRole && deckmodel.Public != null ? deckmodel.Public.Value : deck.Public;
            deck.Approved = deck.Public;

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var deck = await dbContext.Decks.FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var derivedDecks = dbContext.Decks.Where(d => d.SourceId == deck.Id);

            foreach (var derivedDeck in derivedDecks)
            {
                derivedDeck.SourceId = null;
            }

            dbContext.Decks.Remove(deck);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/remainingcards")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CardApiModel>>> GetRemainingCards(int id)
        {
            var deck = await dbContext.Decks
                            .Include(d => d.CardAssignments)
                                .ThenInclude(ca => ca.Card)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            bool userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            // Check the deck belongs with the current user
            if (userIsInUserRole && deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var cardIds = dbContext.CardAssignments
                            .Where(ca => ca.DeckId == deck.Id)
                            .AsNoTracking()
                            .Select(ca => ca.CardId);
            var remainingCards = dbContext.Cards
                                    .Include(c => c.Backs)
                                        .ThenInclude(b => b.Author)
                                    .Include(c => c.CardOwners)
                                    .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null &&
                                        !cardIds.Contains(c.Id))
                                    .OrderBy(c => c.Front)
                                    .AsNoTracking();

            var cardmodels = new List<CardApiModel>();

            foreach (var card in remainingCards)
            {
                var cardmodel = new CardApiModel(card);
                var backs = card.Backs.Where(b => b.OwnerId == user.Id && !b.Public);

                foreach (var back in backs)
                {
                    cardmodel.Backs.Add(new BackApiModel(back));
                }

                cardmodels.Add(cardmodel);
            }

            return cardmodels;
        }

        [HttpPut("{id}/cards")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> InsertCards(int id, [FromBody] int[] cardIds)
        {
            var deck = await dbContext.Decks.FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var cards = await dbContext.Cards
                            .Include(c => c.CardOwners)
                            .Include(c => c.CardAssignments)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null &&
                                cardIds.Contains(c.Id))
                            .ToListAsync();

            if (cards.Count != cardIds.Length)
            {
                ModelState.AddModelError("CardIds",
                    "At least one card that does not belong with you or does not exist");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            foreach (var card in cards)
            {
                if (await dbContext.CardAssignments.FirstOrDefaultAsync(ca => ca.DeckId == deck.Id &&
                    ca.CardId == card.Id) == null)
                {
                    dbContext.CardAssignments.Add(new CardAssignment
                    {
                        DeckId = deck.Id,
                        CardId = card.Id
                    });
                }
            }

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}/cards")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveCards(int id, [FromBody] int[] cardIds)
        {
            var deck = await dbContext.Decks.FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var cardAssignments = await dbContext.CardAssignments
                                        .Include(ca => ca.Card)
                                            .ThenInclude(c => c.CardOwners)
                                        .Where(ca => ca.DeckId == deck.Id && cardIds.Contains(ca.CardId) &&
                                            ca.Card.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
                                        .ToListAsync();

            if (cardAssignments.Count != cardIds.Length)
            {
                ModelState.AddModelError("CardIds",
                    "At least one card that does not belong with you or is not included in this deck or does not exist");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            dbContext.CardAssignments.RemoveRange(cardAssignments);

            var testedCards = dbContext.TestedCards
                                .Include(tc => tc.Test)
                                .Where(tc => tc.Test.DeckId == deck.Id && cardIds.Contains(tc.CardId));

            dbContext.TestedCards.RemoveRange(testedCards);

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/test")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateTest(int id, [FromBody] TestRequestModel testmodel)
        {
            var deck = await dbContext.Decks.FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            foreach (var failedCardId in testmodel.FailedCardIds)
            {
                if (testmodel.SuccessCardIds.Contains(failedCardId))
                {
                    ModelState.AddModelError("", "At least one card belongs to both");
                    break;
                }
            }

            int failedCardsCount = await dbContext.CardAssignments
                                        .Include(c => c.Deck)
                                        .Where(c => c.DeckId == deck.Id && testmodel.FailedCardIds.Contains(c.CardId))
                                        .CountAsync();
            int successCardsCount = await dbContext.CardAssignments
                                        .Include(c => c.Deck)
                                        .Where(c => c.DeckId == deck.Id && testmodel.SuccessCardIds.Contains(c.CardId))
                                        .CountAsync();

            if (failedCardsCount != testmodel.FailedCardIds.Length)
            {
                ModelState.AddModelError("FailedCardIds",
                    "The FailedCardIds containing card does not belong with deck or does not exist");
            }
            if (successCardsCount != testmodel.SuccessCardIds.Length)
            {
                ModelState.AddModelError("SuccessCardIds",
                    "The SuccessCardIds containing card does not belong with deck or does not exist");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            float score = (float)testmodel.SuccessCardIds.Length / (testmodel.FailedCardIds.Length + testmodel.SuccessCardIds.Length);

            var test = new Test()
            {
                DateTime = DateTime.Now,
                DeckId = deck.Id,
                Score = (float)Math.Round(score * 1000) / 100,
                TestedCards = new List<TestedCard>()
            };

            foreach (var failedCardId in testmodel.FailedCardIds)
            {
                test.TestedCards.Add(new TestedCard()
                {
                    CardId = failedCardId,
                    Failed = true
                });
            }
            foreach (var successCardId in testmodel.SuccessCardIds)
            {
                test.TestedCards.Add(new TestedCard()
                {
                    CardId = successCardId,
                    Failed = false
                });
            }

            dbContext.Tests.Add(test);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{id}/pages")]
        public async Task<ActionResult<int>> GetNumberOfCardPages(int id, int pageSize)
        {
            var deck = await dbContext.Decks
                            .Include(d => d.Owner)
                            .Include(d => d.CardAssignments)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);

            bool userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);
            bool ownerIsInUserRole = await userManager.IsInRoleAsync(deck.Owner, Roles.User);

            // Check the deck belongs with current user or is pucblic, if user is in administrator
            if (userIsInUserRole && deck.OwnerId != user.Id && (ownerIsInUserRole || !deck.Public || !deck.Approved))
            {
                return Forbid();
            }

            if (pageSize <= 0)
            {
                return 1;
            }
            return (int)Math.Ceiling((float)deck.CardAssignments.Count / pageSize);
        }
    }
}