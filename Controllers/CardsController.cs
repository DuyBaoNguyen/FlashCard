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
        public async Task<IEnumerable<CardApiModel>> GetAllByUser(int pageSize = 10, int pageIndex = 1)
        {
            var user = await UserService.GetUser(userManager, User);
            var cards = dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .Where(c => c.CardOwners.FirstOrDefault(co => co.UserId == user.Id) != null)
                            .Skip((pageIndex - 1) * pageSize)
                            .Take(pageSize)
                            .AsNoTracking();

            var cardmodels = new List<CardApiModel>();

            foreach (var card in cards)
            {
                var backs = card.Backs.Where(b => b.OwnerId == user.Id);
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

                cardmodels.Add(new CardApiModel
                {
                    Id = card.Id,
                    Front = card.Front,
                    Backs = backmodels
                });
            }

            return cardmodels;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardApiModel>> GetById(int id)
        {
            var card = await dbContext.Cards
                            .Include(c => c.Backs)
                                .ThenInclude(b => b.Author)
                            .Include(c => c.CardOwners)
                                .ThenInclude(co => co.User)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound();
            }

            var user = await UserService.GetUser(userManager, User);
            var isAdmin = await userManager.IsInRoleAsync(user, Roles.Administrator);
            

            var backs = card.Backs.Where(b => b.OwnerId == user.Id);
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

            return new CardApiModel
            {
                Id = card.Id,
                Front = card.Front,
                Backs = backmodels
            };
        }
    }
}