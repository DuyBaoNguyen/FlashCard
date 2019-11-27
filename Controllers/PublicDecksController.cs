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
        public IEnumerable<PublicDeckApiModel> GetAll()
        {
            var decks = dbContext.Decks
                            .Include(d => d.Category)
                            .Include(d => d.Author)
                            .Include(d => d.CardAssignments)
                            .Include(d => d.Proposals)
                                .ThenInclude(p => p.User)
                            .Where(d => d.Public && d.Approved)
                            .AsNoTracking();

            var deckmodels = new List<PublicDeckApiModel>();

            foreach (var deck in decks)
            {
                deckmodels.Add(new PublicDeckApiModel(deck));
            }

            return deckmodels;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PublicDeckApiModel>> GetById(int id, int? pageSize, int pageIndex = 1)
        {
            var deck = await dbContext.Decks
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

            if (deck == null)
            {
                return NotFound();
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
            var admin = await UserService.GetAdmin(dbContext);

            foreach (var cardAssignment in cardAssignments)
            {
                cardmodels.Add(new CardApiModel(cardAssignment.Card, admin));
            }

            var deckmodel = new PublicDeckApiModel(deck);
            deckmodel.Cards = cardmodels;

            return deckmodel;
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