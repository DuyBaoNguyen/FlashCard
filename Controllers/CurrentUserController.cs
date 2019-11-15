using System;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;
using FlashCard.ApiModels;
using FlashCard.Models;
using FlashCard.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlashCard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class CurrentUserController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;

        public CurrentUserController(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet("{getAvatar?}")]
        public async Task<UserApiModel> Get(bool getAvatar)
        {
            var user = await UserService.GetUser(userManager, User);

            if (user == null)
            {
                return null;
            }

            var roles = await userManager.GetRolesAsync(user);
            string image = null;
            if (getAvatar && user.Avatar != null)
            {
                image = Convert.ToBase64String(user.Avatar);
            }

            return new UserApiModel()
            {
                Id = user.Id,
                DisplayName = user.Name,
                Email = user.Email,
                Role = roles[0],
                Image = image
            };
        }
    }
}