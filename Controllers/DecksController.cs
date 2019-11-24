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
    // [ApiController]
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
        public async Task<IEnumerable<DeckApiModel>> GetAllByUser()
        {
            var user = await UserService.GetUser(userManager, User);
            var decks = dbContext.Decks
                            .Include(d => d.Category)
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
                            .Include(d => d.Proposals)
                                .ThenInclude(p => p.User)
                            .Where(d => d.OwnerId == user.Id)
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

            var cardmodels = new List<CardApiModel>();
            
            foreach (var cardAssignment in cardAssignments)
            {
                cardmodels.Add(new CardApiModel(cardAssignment.Card, user));
            }

            var deckmodel = new DeckApiModel(deck);
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

            dbContext.Decks.Remove(deck);
            await dbContext.SaveChangesAsync();

            return NoContent();
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