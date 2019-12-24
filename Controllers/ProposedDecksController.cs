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
    public class ProposedDecksController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public ProposedDecksController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<DeckApiModel>>> GetAllProposedDecks()
        {
            var userId = UserService.GetUserId(User);
            var admin = await UserService.GetAdmin(dbContext);

            if (admin.Id != userId)
            {
                return Forbid();
            }

            var decks = dbContext.Decks
                            .Include(d => d.Category)
                            .Include(d => d.Owner)
                            .Include(d => d.Author)
                            .Include(d => d.CardAssignments)
                            .Include(d => d.Proposals)
                                .ThenInclude(p => p.User)
                            .Where(d => d.OwnerId == admin.Id && d.Public && !d.Approved)
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
        public async Task<ActionResult<DeckApiModel>> ProposeDeck([FromBody] DeckRequestModel deckModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == deckModel.Category.Id);
            var user = await UserService.GetUser(userManager, User);
            var admin = await UserService.GetAdmin(dbContext);
            var deckNames = dbContext.Decks
                                .Where(d => d.OwnerId == admin.Id)
                                .Select(d => d.Name.ToLower())
                                .ToHashSet<string>();
            var newDeckName = deckModel.Name.Trim().ToLower();

            if (category == null)
            {
                ModelState.AddModelError("Category.Id", "The Category Id is not provided or does not exist.");
            }
            if (deckNames.Contains(newDeckName))
            {
                ModelState.AddModelError("Name", "The deck name is taken.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            var deck = new Deck()
            {
                Name = deckModel.Name.Trim(),
                Description = deckModel.Description?.Trim(),
                Public = true,
                Approved = userIsInAdminRole,
                CreatedDate = DateTime.Now,
                LastModified = DateTime.Now,
                Category = category,
                OwnerId = admin.Id,
                AuthorId = user.Id
            };

            dbContext.Decks.Add(deck);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProposedDeck), new { id = deck.Id }, new DeckApiModel(deck));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DeckApiModel>> GetProposedDeck(int id)
        {
            var proposalsCount = await dbContext.Proposals
                                    .Where(p => p.DeckId == id && !p.Approved)
                                    .CountAsync();
            var deck = await dbContext.Decks
                         .Include(d => d.Category)
                         .Include(d => d.Owner)
                         .Include(d => d.Author)
                         .Include(d => d.CardAssignments)
                         .Include(d => d.Proposals)
                             .ThenInclude(p => p.User)
                         .AsNoTracking()
                         .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null || proposalsCount == 0 && (!deck.Public || deck.Approved))
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var admin = await UserService.GetAdmin(dbContext);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole && deck.AuthorId != user.Id)
            {
                return Forbid();
            }

            return new DeckApiModel(deck);
        }

        [HttpGet("{id}/cards")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CardApiModel>>> GetCardsOfProposedDeck(int id)
        {
            var deck = await dbContext.Decks
                           .AsNoTracking()
                           .FirstOrDefaultAsync(d => d.Id == id);
            var user = await UserService.GetUser(userManager, User);
            var admin = await UserService.GetAdmin(dbContext);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (deck == null || (userIsInUserRole && !deck.Public))
            {
                return NotFound();
            }

            if (userIsInUserRole && !deck.Approved && deck.AuthorId != user.Id)
            {
                return Forbid();
            }

            var cards = dbContext.Cards
                            .Include(c => c.CardAssignments)
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Where(c => c.CardAssignments.FirstOrDefault(ca => ca.DeckId == deck.Id) != null)
                            .AsNoTracking()
                            .OrderBy(c => c.Front);
            var cardModels = new List<CardApiModel>();

            foreach (var card in cards)
            {
                var cardModel = new CardApiModel(card);
                var backs = card.Backs.Where(b => b.OwnerId == admin.Id && b.Approved);

                foreach (var back in backs)
                {
                    cardModel.Backs.Add(new BackApiModel(back));
                }

                cardModels.Add(cardModel);
            }

            return cardModels;
        }

        [HttpGet("{id}/remainingcards")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CardApiModel>>> GetRemainingCardsForProposing(int id)
        {
            var deck = await dbContext.Decks
                           .AsNoTracking()
                           .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null || !deck.Public)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var admin = await UserService.GetAdmin(dbContext);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole && !deck.Approved && deck.AuthorId != user.Id)
            {
                return Forbid();
            }

            var cards = dbContext.Cards
                            .Include(c => c.CardAssignments)
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                            .Where(c => c.CardAssignments.FirstOrDefault(ca => ca.DeckId == id) == null &&
                                c.CardOwners.FirstOrDefault(co => co.UserId == admin.Id) != null &&
                                c.Backs.FirstOrDefault(b => b.AuthorId == user.Id || b.AuthorId == admin.Id) != null)
                            .AsNoTracking()
                            .OrderBy(c => c.Front);
            var addedCardIds = dbContext.Proposals
                                   .Where(p => p.UserId == user.Id && p.DeckId == id &&
                                       p.Action == ProposalAction.Add && !p.Approved)
                                   .AsNoTracking()
                                   .Select(p => p.CardId)
                                   .ToHashSet<int>();
            var cardModels = new List<CardApiModel>();

            foreach (var card in cards)
            {
                if (!addedCardIds.Contains(card.Id))
                {
                    var cardModel = new CardApiModel(card);
                    var backs = card.Backs.Where(b => b.OwnerId == admin.Id && (b.AuthorId == user.Id || b.Approved));

                    foreach (var back in backs)
                    {
                        cardModel.Backs.Add(new BackApiModel(back));
                    }

                    cardModels.Add(cardModel);
                }
            }

            return cardModels;
        }

        [HttpGet("{id}/proposals")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<ProposalApiModel>>> GetAddedCardsOfProposedDeck(int id)
        {
            var deck = await dbContext.Decks
                           .AsNoTracking()
                           .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null || !deck.Public)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var admin = await UserService.GetAdmin(dbContext);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole && !deck.Approved && deck.AuthorId != user.Id)
            {
                return Forbid();
            }

            var proposals = dbContext.Proposals
                                .Include(p => p.Card)
                                    .ThenInclude(c => c.Backs)
                                        .ThenInclude(b => b.Author)
                                .Include(p => p.User)
                                .Where(p => (!userIsInUserRole || p.UserId == user.Id) &&
                                    p.DeckId == id && p.Action == ProposalAction.Add && !p.Approved)
                                .AsNoTracking();
            var proposalModels = new List<ProposalApiModel>();

            foreach (var proposal in proposals)
            {
                var proposalModel = new ProposalApiModel(proposal);
                var backs = proposal.Card.Backs.Where(b => b.OwnerId == admin.Id &&
                    (b.AuthorId == proposal.UserId || b.Approved));

                foreach (var back in backs)
                {
                    proposalModel.Card.Backs.Add(new BackApiModel(back));
                }

                proposalModels.Add(proposalModel);
            }

            return proposalModels;
        }

        [HttpPost("{id}/proposals")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ProposeCardForDeck(int id, [FromBody] ProposalRequestModel proposalModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var deck = await dbContext.Decks
                           .Include(d => d.Proposals)
                           .Include(d => d.CardAssignments)
                           .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var admin = await UserService.GetAdmin(dbContext);
            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            if (userIsInAdminRole)
            {
                return Ok();
            }
            if (!deck.Public || !deck.Approved && deck.AuthorId != user.Id)
            {
                return Forbid();
            }

            // Check validation of the request model
            var proposedCard = await dbContext.Cards
                                   .Include(c => c.CardOwners)
                                   .Include(c => c.Backs)
                                   .FirstOrDefaultAsync(c => c.Id == proposalModel.CardId);

            if (proposedCard == null)
            {
                ModelState.AddModelError("CardId", "The card does not exist.");
            }
            else if (deck.CardAssignments.FirstOrDefault(ca => ca.CardId == proposedCard.Id) != null)
            {
                ModelState.AddModelError("CardId", "The card is already included in this deck.");
            }
            else if (proposedCard.CardOwners.FirstOrDefault(co => co.UserId == admin.Id) == null ||
                proposedCard.Backs.FirstOrDefault(b => b.Approved || b.AuthorId == user.Id) == null)
            {
                ModelState.AddModelError("CardId", "The card is not public.");
            }
            else if (deck.Proposals.FirstOrDefault(p => p.CardId == proposedCard.Id && p.UserId == user.Id) != null)
            {
                ModelState.AddModelError("CardId", "You already have proposed this card for deck");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            deck.Proposals.Add(new Proposal()
            {
                CardId = proposedCard.Id,
                UserId = user.Id,
                DateTime = DateTime.Now,
                Action = ProposalAction.Add
            });
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ApproveProposedDeck(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }

            var deck = await dbContext.Decks.FindAsync(id);

            if (deck == null)
            {
                return NotFound();
            }
            if (!deck.Public || deck.Approved)
            {
                return Forbid();
            }

            if (await dbContext.Proposals.FirstOrDefaultAsync(p => p.DeckId == deck.Id && !p.Approved) != null)
            {
                ModelState.AddModelError("", "At least a card is not approved.");
                return BadRequest(ModelState);
            }

            deck.Approved = true;
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProposedDeck(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }

            var deck = await dbContext.Decks.FindAsync(id);

            if (deck == null)
            {
                return NotFound();
            }
            if (!deck.Public || deck.Approved)
            {
                return Forbid();
            }

            dbContext.Decks.Remove(deck);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}