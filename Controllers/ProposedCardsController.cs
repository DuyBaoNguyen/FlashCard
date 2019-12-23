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
    public class ProposedCardsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public ProposedCardsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<CardApiModel>>> GetAllProposedCards()
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }

            var proposedCards = dbContext.Cards
                                    .Include(c => c.Backs)
                                        .ThenInclude(b => b.Author)
                                    .Where(c => c.Backs.FirstOrDefault(b => b.Public && !b.Approved) != null)
                                    .AsNoTracking();
            var cardModels = new List<CardApiModel>();

            foreach (var proposedCard in proposedCards)
            {
                var cardModel = new CardApiModel(proposedCard);
                var backs = proposedCard.Backs.Where(b => b.OwnerId == user.Id && b.Public && !b.Approved);

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
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardApiModel>> GetProposedCardByFront(string front)
        {
            var user = await UserService.GetUser(userManager, User);
            var userIsInUserRole = await userManager.IsInRoleAsync(user, Roles.User);

            if (userIsInUserRole)
            {
                return Forbid();
            }

            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Where(c => c.Backs.Where(b => b.Public && !b.Approved).Count() > 0)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(c => c.Front == front);
            if (card == null)
            {
                return NotFound();
            }

            var cardModel = new CardApiModel(card);
            var backs = card.Backs.Where(b => b.Public && !b.Approved);

            foreach (var back in backs)
            {
                cardModel.Backs.Add(new BackApiModel(back));
            }

            return cardModel;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ProposeCard([FromBody] CardRequestModel cardModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                            .Include(c => c.CardOwners)
                            .FirstOrDefaultAsync(c => c.Front == cardModel.Front);

            if (card == null)
            {
                card = new Card()
                {
                    Front = cardModel.Front,
                    Backs = new List<Back>(),
                    CardOwners = new List<CardOwner>()
                };
                dbContext.Cards.Add(card);
            }

            var image = ImageService.GetImage(cardModel.Back.Image);
            var admin = await UserService.GetAdmin(dbContext);
            var user = await UserService.GetUser(userManager, User);
            var userIsInAdminRole = await userManager.IsInRoleAsync(user, Roles.Administrator);

            if (card.CardOwners.Where(co => co.CardId == card.Id && co.UserId == admin.Id).Count() == 0)
            {
                card.CardOwners.Add(new CardOwner() { UserId = admin.Id });
            }

            card.Backs.Add(new Back()
            {
                Type = cardModel.Back.Type,
                Meaning = cardModel.Back.Meaning,
                Example = cardModel.Back.Example,
                Image = image?.Data,
                ImageType = image?.Type,
                Public = true,
                Approved = userIsInAdminRole,
                LastModified = DateTime.Now,
                OwnerId = admin.Id,
                AuthorId = user.Id
            });

            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}