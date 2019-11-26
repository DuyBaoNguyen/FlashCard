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
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
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
                cardmodels.Add(new CardApiModel(card, user));
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

            var card = await dbContext.Cards
                            .Include(c => c.CardAssignments)
                            .Include(c => c.CardOwners)
                            .Include(c => c.Backs)
                            .FirstOrDefaultAsync(c => c.Front == cardmodel.Front);
            bool createNewCard = false;
            var image = ImageService.GetImage(cardmodel.Back.Image);

            if (card == null)
            {
                card = new Card()
                {
                    Front = cardmodel.Front.ToLower(),
                    CardAssignments = new List<CardAssignment>(),
                    CardOwners = new List<CardOwner>(),
                    Backs = new List<Back>()
                };
                createNewCard = true;
            }

            if (card.CardOwners.FirstOrDefault(co => co.UserId == user.Id) == null)
            {
                card.CardOwners.Add(new CardOwner() { UserId = user.Id });
            }

            card.Backs.Add(new Back
            {
                Type = cardmodel.Back.Type,
                Meaning = cardmodel.Back.Meaning,
                Example = cardmodel.Back.Example,
                Image = image?.Data,
                ImageType = image?.Type,
                LastModified = DateTime.Now,
                OwnerId = user.Id,
                AuthorId = user.Id
            });

            if (createNewCard)
            {
                dbContext.Cards.Add(card);
            }
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { Id = card.Id }, new CardApiModel(card, user));
        }

        [HttpGet("{front}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardApiModel>> GetById(string front)
        {
            var user = await UserService.GetUser(userManager, User);
            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(c => c.Front == front);

            if (card == null)
            {
                return NotFound();
            }

            return new CardApiModel(card, user);
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
            if (front == cardmodel.Front)
            {
                return NoContent();
            }

            var newCard = await dbContext.Cards
                                .Include(c => c.CardOwners)
                                .FirstOrDefaultAsync(c => c.Front == cardmodel.Front &&
                                    c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null);

            if (newCard != null)
            {
                ModelState.AddModelError("Front", "The Front is already taken");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remove relationship between the card and the user
            dbContext.CardOwners.Remove(dbContext.CardOwners.First(co => co.UserId == user.Id && co.CardId == card.Id));

            // Remove relationship between the card and decks containing it
            var decks = dbContext.Decks
                            .Include(d => d.CardAssignments)
                            .Where(d => d.OwnerId == user.Id &&
                                d.CardAssignments.FirstOrDefault(ca => ca.CardId == card.Id) != null);

            foreach (var deck in decks)
            {
                dbContext.CardAssignments.Remove(deck.CardAssignments.First(ca => ca.CardId == card.Id));
            }

            // Remove relationship between the card and tests
            var tests = dbContext.Tests
                            .Include(t => t.Deck)
                            .Include(t => t.FailedCards)
                            .Where(t => t.Deck.OwnerId == user.Id &&
                                t.FailedCards.FirstOrDefault(f => f.CardId == card.Id) != null);

            foreach (var test in tests)
            {
                dbContext.FailedCards.Remove(test.FailedCards.First(f => f.CardId == card.Id));
            }

            // Check if there is card being new front
            var updatedCard = await dbContext.Cards
                                .Include(c => c.CardAssignments)
                                .Include(c => c.CardOwners)
                                .FirstOrDefaultAsync(c => c.Front == cardmodel.Front);
            var backs = dbContext.Backs.Where(b => b.OwnerId == user.Id && b.CardId == card.Id);

            if (updatedCard == null)
            {
                updatedCard = new Card()
                {
                    Front = cardmodel.Front.ToLower(),
                    CardAssignments = new List<CardAssignment>(),
                    CardOwners = new List<CardOwner>()
                };
                dbContext.Cards.Add(updatedCard);
            }

            updatedCard.CardOwners.Add(new CardOwner() { UserId = user.Id });

            foreach (var deck in decks)
            {
                updatedCard.CardAssignments.Add(new CardAssignment() { DeckId = deck.Id });
            }
            foreach (var test in tests)
            {
                updatedCard.FailedCards.Add(new FailedCard() { TestId = test.Id });
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
            dbContext.FailedCards.RemoveRange(dbContext.FailedCards
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