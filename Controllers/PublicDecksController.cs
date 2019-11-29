using System;
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
    public class PublicDecksController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public PublicDecksController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<PublicDeckApiModel>> GetAll()
        {
            var publicDecks = dbContext.Decks
                                .Include(d => d.Category)
                                .Include(d => d.Author)
                                .Include(d => d.CardAssignments)
                                .Include(d => d.Proposals)
                                    .ThenInclude(p => p.User)
                                .Where(d => d.Public && d.Approved)
                                .AsNoTracking();

            var user = await UserService.GetUser(userManager, User);
            var privateDeckIds = dbContext.Decks
                                    .Where(d => d.OwnerId == user.Id && d.FromAdmin && d.SourceId != null)
                                    .AsNoTracking()
                                    .Select(d => d.SourceId)
                                    .ToArray();
            var deckmodels = new List<PublicDeckApiModel>();

            foreach (var deck in publicDecks)
            {
                var deckmodel = new PublicDeckApiModel(deck);
                deckmodel.Had = privateDeckIds.Contains(deck.Id);
                deckmodels.Add(deckmodel);
            }

            return deckmodels;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PublicDeckApiModel>> GetById(int id, int? pageSize, int pageIndex = 1)
        {
            var publicDeck = await dbContext.Decks
                                .Include(d => d.Category)
                                .Include(d => d.Author)
                                .Include(d => d.CardAssignments)
                                    .ThenInclude(ca => ca.Card)
                                        .ThenInclude(c => c.Backs)
                                            .ThenInclude(b => b.Author)
                                .Include(d => d.Proposals)
                                    .ThenInclude(p => p.User)
                                .AsNoTracking()
                                .FirstOrDefaultAsync(d => d.Id == id && d.Public && d.Approved);

            if (publicDeck == null)
            {
                return NotFound();
            }

            // Paginate cards of deck if pageSize parameter is specified
            var cardAssignments = publicDeck.CardAssignments;

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
            var admin = await UserService.GetAdmin(dbContext);
            var user = await UserService.GetUser(userManager, User);
            var privateDeck = await dbContext.Decks
                                .FirstOrDefaultAsync(d => d.OwnerId == user.Id && d.SourceId == publicDeck.Id);

            foreach (var cardAssignment in cardAssignments)
            {
                var cardmodel = new CardApiModel(cardAssignment.Card);
                var backs = cardAssignment.Card.Backs.Where(b => b.OwnerId == admin.Id && b.Approved);

                foreach (var back in backs)
                {
                    cardmodel.Backs.Add(new BackApiModel(back));
                }

                cardmodels.Add(cardmodel);
            }

            var deckmodel = new PublicDeckApiModel(publicDeck);
            deckmodel.Cards = cardmodels;
            deckmodel.Had = privateDeck != null;

            return deckmodel;
        }

        [HttpGet("{id}/remainingcards")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CardApiModel>>> GetRemainingCards(int id)
        {
            var deck = await dbContext.Decks
                            .Include(d => d.CardAssignments)
                                .ThenInclude(ca => ca.Card)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(d => d.Id == id && d.Public && d.Approved);

            if (deck == null)
            {
                return NotFound();
            }

            var admin = await UserService.GetAdmin(dbContext);
            var cardIds = dbContext.CardAssignments
                            .Where(ca => ca.DeckId == deck.Id)
                            .AsNoTracking()
                            .Select(ca => ca.CardId);
            var remainingCards = dbContext.Cards
                                    .Include(c => c.Backs)
                                        .ThenInclude(b => b.Author)
                                    .Include(c => c.CardOwners)
                                    .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == admin.Id) != null &&
                                        !cardIds.Contains(c.Id))
                                    .AsNoTracking();
            var cardmodels = new List<CardApiModel>();

            foreach (var card in remainingCards)
            {
                var cardmodel = new CardApiModel(card);
                var backs = card.Backs.Where(b => b.OwnerId == admin.Id && b.Approved);

                foreach (var back in backs)
                {
                    cardmodel.Backs.Add(new BackApiModel(back));
                }

                cardmodels.Add(cardmodel);
            }

            return cardmodels;
        }

        [HttpGet("{id}/pages")]
        public async Task<ActionResult<int>> GetNumberOfCardPages(int id, int pageSize)
        {
            var deck = await dbContext.Decks
                            .Include(d => d.CardAssignments)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(d => d.Id == id && d.Public && d.Approved);

            if (deck == null)
            {
                return NotFound();
            }

            if (pageSize <= 0)
            {
                return 1;
            }
            return (int)Math.Ceiling((float)deck.CardAssignments.Count / pageSize);
        }
    }
}