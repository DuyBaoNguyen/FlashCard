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
    public class PublicCardsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public PublicCardsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IEnumerable<CardApiModel> GetAll()
        {
            var cards = dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Where(c => c.Backs.Where(b => b.Approved).Count() > 0)
                            .OrderBy(c => c.Front)
                            .AsNoTracking();

            var cardModels = new List<CardApiModel>();

            foreach (var card in cards)
            {
                var cardModel = new CardApiModel(card);
                var backs = card.Backs.Where(b => b.Approved);

                foreach (var back in backs)
                {
                    cardModel.Backs.Add(new BackApiModel(back));
                }

                cardModels.Add(cardModel);
            }

            return cardModels;
        }

        [HttpGet("{front}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardApiModel>> GetByFront(string front)
        {
            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Where(c => c.Backs.Where(b => b.Approved).Count() > 0)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(c => c.Front == front);
            if (card == null)
            {
                return NotFound();
            }

            var cardModel = new CardApiModel(card);
            var backs = card.Backs.Where(b => b.Approved);

            foreach (var back in backs)
            {
                cardModel.Backs.Add(new BackApiModel(back));
            }

            return cardModel;
        }

        [HttpGet("download")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DownloadAll()
        {
            var userId = UserService.GetUserId(User);
            var admin = await UserService.GetAdmin(dbContext);

            if (admin.Id == userId)
            {
                return Ok();
            }

            var publicCards = dbContext.Cards
                                .Include(c => c.Backs)
                                .Where(c => c.Backs.Where(b => b.Approved).Count() > 0);
            var OwnedCardIds = dbContext.CardOwners
                                    .Where(co => co.UserId == userId)
                                    .Select(co => co.CardId)
                                    .ToHashSet<int>();
            var OwnedBackIds = dbContext.Backs
                                    .Where(b => b.OwnerId == userId && b.SourceId != null)
                                    .Select(b => b.SourceId)
                                    .ToHashSet<int?>();
            var newBacks = new List<Back>();

            foreach (var publicCard in publicCards)
            {
                // Add card to user if user does not own it
                if (!OwnedCardIds.Contains(publicCard.Id))
                {
                    dbContext.CardOwners.Add(new CardOwner()
                    {
                        CardId = publicCard.Id,
                        UserId = userId
                    });
                }

                // Add back to user if user does not have any back deriving from public back
                foreach (var back in publicCard.Backs)
                {
                    if (back.Approved && !OwnedBackIds.Contains(back.Id))
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
                            CardId = publicCard.Id,
                            SourceId = back.Id,
                            OwnerId = userId,
                            AuthorId = back.AuthorId
                        });
                    }
                }
            }

            dbContext.Backs.AddRange(newBacks);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}