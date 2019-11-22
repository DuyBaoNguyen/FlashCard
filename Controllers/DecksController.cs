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
                var source = deck.Source == null ? null : new DeckApiModel
                {
                    Id = deck.Source.Id,
                    Name = deck.Source.Name,
                    Description = deck.Source.Description,
                    Public = deck.Source.Public,
                    CreatedDate = deck.Source.CreatedDate,
                    LastModified = deck.Source.LastModified,
                    Approved = deck.Source.Approved,
                    Owner = new { Id = deck.Source.OwnerId, DisplayName = deck.Source.Owner.Name },
                    Author = deck.Source.Author == null ? null :
                        new { Id = deck.Source.AuthorId, DisplayName = deck.Source.Author.Name },
                    Category = new CategoryApiModel() { Id = deck.Source.CategoryId, Name = deck.Source.Category.Name },
                    TotalCards = deck.Source.CardAssignments.Count()
                };

                var contributors = new List<object>();

                foreach (var proposal in deck.Proposals)
                {
                    if (proposal.UserId == user.Id && proposal.Approved)
                    {
                        contributors.Add(new { Id = proposal.UserId, DisplayName = proposal.User.Name });
                    }
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
                    Owner = new { Id = deck.OwnerId, DisplayName = deck.Owner.Name },
                    Author = deck.Author == null ? null :
                        new { Id = deck.AuthorId, DisplayName = deck.Author.Name },
                    Contributors = contributors,
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

            var category = deckModel.Category == null ? null : await dbContext.Categories.FindAsync(deckModel.Category.Id);

            if (category == null)
            {
                ModelState.AddModelError("Category", "Category does not exist");
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DeckApiModel>> GetById(int id)
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

            // Check the deck belongs with current user or is pucblic, if user is in administrator
            if (userIsInUserRole && deck.OwnerId != user.Id && (ownerIsInUserRole || !deck.Public || !deck.Approved))
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
                Owner = new { Id = deck.Source.OwnerId, DisplayName = deck.Source.Owner.Name },
                Author = deck.Source.Author == null ? null :
                    new { Id = deck.Source.AuthorId, DisplayName = deck.Source.Author.Name },
                Category = new CategoryApiModel() { Id = deck.Source.CategoryId, Name = deck.Source.Category.Name },
                TotalCards = deck.Source.CardAssignments.Count()
            };

            var contributors = new List<object>();

            foreach (var proposal in deck.Proposals)
            {
                if (proposal.UserId == user.Id && proposal.Approved)
                {
                    contributors.Add(new { Id = proposal.UserId, DisplayName = proposal.User.Name });
                }
            }

            var cards = new List<CardApiModel>();

            foreach (var cardAssignment in deck.CardAssignments)
            {
                var backs = cardAssignment.Card.Backs.Where(b => b.OwnerId == user.Id);
                var backmodels = new List<BackApiModel>();

                foreach (var back in backs)
                {
                    backmodels.Add(new BackApiModel
                    {
                        Id = back.Id,
                        Type = back.Type,
                        Meaning = back.Meaning,
                        Example = back.Example,
                        Image = back.Image == null ? null : $"data:image/{back.ImageType};base64,{Convert.ToBase64String(back.Image)}",
                        Author = back.Author == null ? null : new { Id = back.AuthorId, DisplayName = back.Author.Name }
                    });
                }

                cards.Add(new CardApiModel
                {
                    Id = cardAssignment.CardId,
                    Front = cardAssignment.Card.Front,
                    Backs = backmodels
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
                Owner = new { Id = deck.OwnerId, DisplayName = deck.Owner.Name },
                Author = deck.Author == null ? null :
                    new { Id = deck.AuthorId, DisplayName = deck.Author.Name },
                Contributors = contributors,
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
        public async Task<IActionResult> Update(int id, DeckRequestModel deckmodel)
        {
            var deck = await dbContext.Decks.FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            if (!userIsInAdminRole && deck.OwnerId != user.Id)
            {
                return Forbid();
            }

            var category = deckmodel.Category == null ? null : await dbContext.Categories.FindAsync(deckmodel.Category.Id);

            if (category == null)
            {
                ModelState.AddModelError("Category", "Category does not exist");
                return BadRequest(ModelState);
            }

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