using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.ApiModels;
using FlashCard.Data;
using FlashCard.Models;
using FlashCard.RequestModel;
using FlashCard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Controllers
{
    [ApiController]
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
                            .Include(d => d.Owner)
                            .Include(d => d.Author)
                            .Include(d => d.CardAssignments)
                                .ThenInclude(ca => ca.Card)
                            .Where(d => d.OwnerId == user.Id)
                            .AsNoTracking();

            var deckmodels = new List<DeckApiModel>();
            foreach (var deck in decks)
            {
                var source = deck.Source == null ? null : new DeckApiModel
                {
                    Id = deck.Source.Id,
                    Name = deck.Source.Name,
                    Description = deck.Source.Description,
                    Public = deck.Source.Public,
                    CreatedDate = deck.Source.CreatedDate,
                    LastModified = deck.Source.LastModified,
                    Approved = deck.Source.Approved,
                    Version = deck.Source.Version,
                    Owner = deck.Source.Owner.Name,
                    Author = deck.Source.Author?.Name,
                    Category = new CategoryApiModel() { Id = deck.Source.CategoryId, Name = deck.Source.Category.Name },
                    TotalCards = deck.Source.CardAssignments.Count()
                };

                var deckmodel = new DeckApiModel
                {
                    Id = deck.Id,
                    Name = deck.Name,
                    Description = deck.Description,
                    Public = deck.Public,
                    CreatedDate = deck.CreatedDate,
                    LastModified = deck.LastModified,
                    Approved = deck.Approved,
                    Version = deck.Version,
                    Owner = deck.Owner.Name,
                    Author = deck.Author?.Name,
                    Category = new CategoryApiModel() { Id = deck.CategoryId, Name = deck.Category.Name },
                    Source = source,
                    TotalCards = deck.CardAssignments.Count()
                };

                deckmodels.Add(deckmodel);
            }

            return deckmodels;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DeckApiModel>> Create(DeckRequestModel deckModel)
        {
            var user = await UserService.GetUser(userManager, User);
            
            var category = await dbContext.Categories.FindAsync(deckModel.CategoryId);

            if (category == null)
            {
                ModelState.AddModelError("CategoryId", "Category does not exist");
                return BadRequest(ModelState);
            }

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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DeckApiModel>> GetById(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var deck = await dbContext.Decks
                            .Include(d => d.Category)
                            .Include(d => d.Source)
                                .ThenInclude(s => s.CardAssignments)
                            .Include(d => d.Owner)
                            .Include(d => d.Author)
                            .Include(d => d.CardAssignments)
                                .ThenInclude(ca => ca.Card)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(d => d.Id == id);
            
            if (deck == null)
            {
                return NotFound();
            }
            
            bool isAdmin = await userManager.IsInRoleAsync(deck.Owner, "admin");

            if (deck.OwnerId != user.Id && (isAdmin == false || (isAdmin == true && deck.Public == false)))
            {
                return Forbid();
            }

            var source = deck.Source == null ? null : new DeckApiModel
            {
                Id = deck.Source.Id,
                Name = deck.Source.Name,
                Description = deck.Source.Description,
                Public = deck.Source.Public,
                CreatedDate = deck.Source.CreatedDate,
                LastModified = deck.Source.LastModified,
                Approved = deck.Source.Approved,
                Version = deck.Source.Version,
                Owner = deck.Source.Owner.Name,
                Author = deck.Source.Author?.Name,
                Category = new CategoryApiModel() { Id = deck.Source.CategoryId, Name = deck.Source.Category.Name },
                TotalCards = deck.Source.CardAssignments.Count()
            };

            var cards = new List<CardApiModel>();

            foreach (var cardAssignment in deck.CardAssignments)
            {
                cards.Add(new CardApiModel
                {
                    Id = cardAssignment.CardId,
                    Front = cardAssignment.Card.Front
                });
            }

            var deckmodel = new DeckApiModel
            {
                Id = deck.Id,
                Name = deck.Name,
                Description = deck.Description,
                Public = deck.Public,
                CreatedDate = deck.CreatedDate,
                LastModified = deck.LastModified,
                Approved = deck.Approved,
                Version = deck.Version,
                Owner = deck.Owner.Name,
                Author = deck.Author?.Name,
                Category = new CategoryApiModel() { Id = deck.CategoryId, Name = deck.Category.Name },
                Source = source,
                TotalCards = deck.CardAssignments.Count(),
                Cards = cards
            };

            return deckmodel;
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, DeckRequestModel deckModel)
        {
            var user = await UserService.GetUser(userManager, User);
            var deck = await dbContext.Decks.FindAsync(id);

            if (deck == null)
            {
                return NotFound();
            }
            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var category = await dbContext.Categories.FindAsync(deckModel.CategoryId);

            if (category == null)
            {
                ModelState.AddModelError("CategoryId", "Category does not exist");
                return BadRequest(ModelState);
            }

            deck.Name = deckModel.Name;
            deck.Description = deckModel.Description;
            deck.Category = category;

            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var deck = await dbContext.Decks.FindAsync(id);

            if (deck == null)
            {
                return NotFound();
            }
            if (deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            dbContext.Decks.RemoveRange(deck);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}