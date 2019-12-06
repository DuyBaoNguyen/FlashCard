using System;
using System.Net.Mime;
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

        [HttpGet]
        public async Task<CurrentUserApiModel> Get()
        {
            var user = await UserService.GetUser(userManager, User);

            if (user == null)
            {
                return null;
            }

            var roles = await userManager.GetRolesAsync(user);

            return new CurrentUserApiModel()
            {
                Id = user.Id,
                DisplayName = user.Name,
                Email = user.Email,
                Role = roles[0],
                Image = ImageService.GetBase64(user.Avatar, user.ImageType)
            };
        }
    }
}