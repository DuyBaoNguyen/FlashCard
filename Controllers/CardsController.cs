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
    public class CardsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public CardsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<CardApiModel>> GetAllByUser(int? pageSize, int pageIndex = 1)
        {
            var user = await UserService.GetUser(userManager, User);
            var cards = dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null &&
                                c.Backs.Where(b => !b.Public || b.Approved).Count() > 0)
                            .OrderBy(c => c.Front)
                            .AsNoTracking();

            if (pageSize != null)
            {
                var numberPages = await GetNumberOfCardPages(pageSize.Value);

                if (pageIndex <= 0)
                {
                    pageIndex = 1;
                }
                else if (pageIndex > numberPages)
                {
                    pageIndex = numberPages;
                }

                pageSize = pageSize <= 0 ? 1 : pageSize;

                cards = cards.Skip((pageIndex - 1) * pageSize.Value).Take(pageSize.Value);
            }

            var cardmodels = new List<CardApiModel>();

            foreach (var card in cards)
            {
                var cardmodel = new CardApiModel(card);
                var backs = card.Backs.Where(b => b.OwnerId == user.Id && (!b.Public || b.Approved));

                foreach (var back in backs)
                {
                    cardmodel.Backs.Add(new BackApiModel(back));
                }

                cardmodels.Add(cardmodel);
            }

            return cardmodels;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CardApiModel>> Create([FromBody] CardRequestModel cardmodel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserService.GetUser(userManager, User);
            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            var card = await dbContext.Cards
                            .Include(c => c.CardAssignments)
                            .Include(c => c.CardOwners)
                            .Include(c => c.Backs)
                            .FirstOrDefaultAsync(c => c.Front == cardmodel.Front.Trim().ToLower());
            var image = ImageService.GetImage(cardmodel.Back.Image);

            if (card == null)
            {
                card = new Card()
                {
                    Front = cardmodel.Front.Trim().ToLower(),
                    CardAssignments = new List<CardAssignment>(),
                    CardOwners = new List<CardOwner>(),
                    Backs = new List<Back>()
                };
                dbContext.Cards.Add(card);
            }

            if (card.CardOwners.FirstOrDefault(co => co.UserId == user.Id) == null)
            {
                card.CardOwners.Add(new CardOwner() { UserId = user.Id });
            }

            card.Backs.Add(new Back
            {
                Type = cardmodel.Back.Type,
                Meaning = cardmodel.Back.Meaning.Trim(),
                Example = cardmodel.Back.Example?.Trim(),
                Image = image?.Data,
                ImageType = image?.Type,
                Public = userIsInAdminRole,
                Approved = userIsInAdminRole,
                LastModified = DateTime.Now,
                OwnerId = user.Id,
                AuthorId = user.Id
            });

            await dbContext.SaveChangesAsync();

            var returnedCard = new CardApiModel(card);
            var backs = card.Backs.Where(b => b.OwnerId == user.Id && (!b.Public || b.Approved));

            foreach (var back in backs)
            {
                returnedCard.Backs.Add(new BackApiModel(back));
            }

            return CreatedAtAction(nameof(GetByFront), new { Id = card.Id }, returnedCard);
        }

        [HttpGet("{front}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardApiModel>> GetByFront(string front)
        {
            var user = await UserService.GetUser(userManager, User);
            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null &&
                                c.Backs.Where(b => !b.Public || b.Approved).Count() > 0)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(c => c.Front == front);

            if (card == null)
            {
                return NotFound();
            }

            var cardmodel = new CardApiModel(card);
            var backs = card.Backs.Where(b => b.OwnerId == user.Id && (!b.Public || b.Approved));

            foreach (var back in backs)
            {
                cardmodel.Backs.Add(new BackApiModel(back));
            }

            return cardmodel;
        }

        [HttpPut("{front}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(string front, [FromBody] SimpleCardRequestModel cardmodel)
        {
            var user = await UserService.GetUser(userManager, User);
            // Check if the user owns the card
            var card = await dbContext.Cards
                            .Include(c => c.CardOwners)
                            .FirstOrDefaultAsync(c => c.Front == front &&
                                c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null);

            if (card == null)
            {
                return NotFound();
            }

            // Check if the new front equals the old front
            if (front.Trim().ToLower() == cardmodel.Front.Trim().ToLower())
            {
                return NoContent();
            }

            var newCard = await dbContext.Cards
                                .Include(c => c.CardOwners)
                                .FirstOrDefaultAsync(c => c.Front == cardmodel.Front.Trim().ToLower() &&
                                    c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null);

            if (newCard != null)
            {
                ModelState.AddModelError("Front", "The Front is taken");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remove relationship between the card and the user
            dbContext.CardOwners.Remove(dbContext.CardOwners.First(co => co.UserId == user.Id && co.CardId == card.Id));

            // Remove relationship between the card and decks containing it
            var cardAssignments = dbContext.CardAssignments
                                    .Include(ca => ca.Deck)
                                    .Where(ca => ca.Deck.OwnerId == user.Id && ca.CardId == card.Id);

            dbContext.CardAssignments.RemoveRange(cardAssignments);

            // Remove relationship between the card and tests
            var testedCards = dbContext.TestedCards
                                .Include(tc => tc.Test)
                                    .ThenInclude(t => t.Deck)
                                .Where(tc => tc.Test.Deck.OwnerId == user.Id && tc.CardId == card.Id);

            dbContext.TestedCards.RemoveRange(testedCards);

            // Check if there is card being new front
            var updatedCard = await dbContext.Cards
                                .Include(c => c.CardAssignments)
                                .Include(c => c.CardOwners)
                                .Include(c => c.TestedCards)
                                .FirstOrDefaultAsync(c => c.Front == cardmodel.Front);
            var backs = dbContext.Backs.Where(b => b.OwnerId == user.Id && b.CardId == card.Id);

            if (updatedCard == null)
            {
                updatedCard = new Card()
                {
                    Front = cardmodel.Front.Trim().ToLower(),
                    CardAssignments = new List<CardAssignment>(),
                    CardOwners = new List<CardOwner>(),
                    TestedCards = new List<TestedCard>()
                };
                dbContext.Cards.Add(updatedCard);
            }

            updatedCard.CardOwners.Add(new CardOwner() { UserId = user.Id });

            foreach (var cardAssignment in cardAssignments)
            {
                updatedCard.CardAssignments.Add(new CardAssignment() { DeckId = cardAssignment.DeckId });
            }
            foreach (var testedCard in testedCards)
            {
                updatedCard.TestedCards.Add(new TestedCard()
                {
                    TestId = testedCard.TestId,
                    Failed = testedCard.Failed
                });
            }
            foreach (var back in backs)
            {
                back.Card = updatedCard;
            }

            await dbContext.SaveChangesAsync();

            // Remove the old card if no user owns it
            if (await dbContext.CardOwners.CountAsync(co => co.CardId == card.Id) == 0)
            {
                dbContext.Cards.Remove(card);
            }

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{front}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string front)
        {
            var user = await UserService.GetUser(userManager, User);
            // Check if the user owns the card
            var card = await dbContext.Cards.FirstOrDefaultAsync(c => c.Front == front &&
                            c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null);

            if (card == null)
            {
                return NotFound();
            }

            // Remove relationship between the card and the user, decks and tests
            dbContext.CardOwners.Remove(dbContext.CardOwners.First(co => co.UserId == user.Id && co.CardId == card.Id));
            dbContext.CardAssignments.RemoveRange(dbContext.CardAssignments
                                                    .Include(ca => ca.Deck)
                                                    .Where(ca => ca.CardId == card.Id && ca.Deck.OwnerId == user.Id));
            dbContext.Backs.RemoveRange(dbContext.Backs.Where(b => b.CardId == card.Id && b.OwnerId == user.Id));
            dbContext.TestedCards.RemoveRange(dbContext.TestedCards
                                                .Include(f => f.Test)
                                                    .ThenInclude(t => t.Deck)
                                                .Where(f => f.Test.Deck.OwnerId == user.Id && f.CardId == card.Id));

            await dbContext.SaveChangesAsync();

            if (await dbContext.CardOwners.CountAsync(co => co.CardId == card.Id) == 0)
            {
                dbContext.Cards.Remove(card);
            }

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("pages")]
        public async Task<int> GetNumberOfCardPages(int pageSize)
        {
            var user = await UserService.GetUser(userManager, User);
            var numberCards = await dbContext.Cards
                                .Include(c => c.CardOwners)
                                    .ThenInclude(co => co.User)
                                .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
                                .CountAsync();

            if (pageSize <= 0)
            {
                return 1;
            }
            return (int)Math.Ceiling((float)numberCards / pageSize);
        }
    }
}