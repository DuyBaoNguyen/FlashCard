using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;
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
    public class DownloadedDeckController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public DownloadedDeckController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Download(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            bool userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            if (userIsInAdminRole)
            {
                return Ok();
            }

            var publicDeck = await dbContext.Decks
                                .Include(d => d.CardAssignments)
                                    .ThenInclude(ca => ca.Card)
                                        .ThenInclude(c => c.Backs)
                                            .ThenInclude(b => b.Author)
                                .Include(d => d.Proposals)
                                .FirstOrDefaultAsync(d => d.Id == id && d.Approved);

            if (publicDeck == null)
            {
                return NotFound();
            }

            var privateDeck = await dbContext.Decks.FirstOrDefaultAsync(d =>
                                d.OwnerId == user.Id && d.SourceId == publicDeck.Id);
            var privateBacks = await dbContext.Backs.Where(b => b.OwnerId == user.Id).ToArrayAsync();

            if (privateDeck != null)
            {
                ModelState.AddModelError("", "You already have this deck.");
                return BadRequest(ModelState);
            }

            var newBacks = new List<Back>();
            var newDeck = new Deck()
            {
                Name = publicDeck.Name,
                Description = publicDeck.Description,
                CreatedDate = publicDeck.CreatedDate,
                LastModified = publicDeck.LastModified,
                Version = publicDeck.Version,
                FromAdmin = true,
                CategoryId = publicDeck.CategoryId,
                SourceId = publicDeck.Id,
                OwnerId = user.Id,
                AuthorId = publicDeck.AuthorId,
                CardAssignments = new List<CardAssignment>(),
                Proposals = new List<Proposal>()
            };

            foreach (var cardAssignment in publicDeck.CardAssignments)
            {
                await dbContext.Entry(cardAssignment.Card).Collection(c => c.CardOwners).LoadAsync();
                // Add card for user who does not own it
                if (cardAssignment.Card.CardOwners.FirstOrDefault(co => co.UserId == user.Id) == null)
                {
                    dbContext.CardOwners.Add(new CardOwner()
                    {
                        CardId = cardAssignment.CardId,
                        UserId = user.Id
                    });
                }

                // Add card for new deck of user
                newDeck.CardAssignments.Add(new CardAssignment() { CardId = cardAssignment.CardId });

                // Add back for card if user does not own it
                foreach (var back in cardAssignment.Card.Backs)
                {
                    if (back.Approved && privateBacks.FirstOrDefault(b => b.SourceId == back.Id) == null)
                    {
                        newBacks.Add(new Back()
                        {
                            Type = back.Type,
                            Meaning = back.Meaning,
                            Example = back.Example,
                            Image = back.Image,
                            ImageType = back.ImageType,
                            LastModified = back.LastModified,
                            Version = back.Version,
                            FromAdmin = true,
                            CardId = cardAssignment.CardId,
                            SourceId = back.Id,
                            OwnerId = user.Id,
                            AuthorId = back.AuthorId
                        });
                    }
                }
            }

            foreach (var proposal in publicDeck.Proposals)
            {
                if (proposal.Approved)
                {
                    newDeck.Proposals.Add(new Proposal()
                    {
                        Action = proposal.Action,
                        DateTime = proposal.DateTime,
                        Approved = proposal.Approved,
                        CardId = proposal.CardId,
                        UserId = proposal.UserId
                    });
                }
            }

            dbContext.Decks.Add(newDeck);
            dbContext.Backs.AddRange(newBacks);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}