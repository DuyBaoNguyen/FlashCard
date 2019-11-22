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
    [ApiController]
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
        public async Task<IEnumerable<CardApiModel>> GetAllByUser(int? pageSize, int pageIndex = 1)
        {
            var user = await UserService.GetUser(userManager, User);
            var cards = dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
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
                var backs = card.Backs.Where(b => b.OwnerId == user.Id);
                var backmodels = new List<BackApiModel>();

                foreach (var back in backs)
                {
                    backmodels.Add(new BackApiModel(back));
                }

                cardmodels.Add(new CardApiModel
                {
                    Id = card.Id,
                    Front = card.Front,
                    Backs = backmodels
                });
            }

            return cardmodels;
        }

        // [HttpPost]
        // [ProducesResponseType(StatusCodes.Status201Created)]
        // [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // public async Task<ActionResult<CardApiModel>> Create(CardRequestModel cardmodel)
        // {

        // }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardApiModel>> GetById(int id)
        {
            var user = await UserService.GetUser(userManager, User);
            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound();
            }

            var backs = card.Backs.Where(b => b.OwnerId == user.Id);
            var backmodels = new List<BackApiModel>();

            foreach (var back in backs)
            {
                backmodels.Add(new BackApiModel(back));
            }

            return new CardApiModel
            {
                Id = card.Id,
                Front = card.Front,
                Backs = backmodels
            };
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