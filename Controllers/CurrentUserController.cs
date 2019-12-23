using System;
using System.Net.Mime;
using System.Text.RegularExpressions;
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

namespace FlashCard.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class CurrentUserController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private SignInManager<ApplicationUser> signInManager;
        private ApplicationDbContext dbContext;

        public CurrentUserController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
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

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update([FromBody] UserRequestModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserService.GetUser(userManager, User);
            user.Name = userModel.DisplayName;

            await dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("changepassword")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordRequestModel passwordModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserService.GetUser(userManager, User);
            var result = await userManager.ChangePasswordAsync(user, passwordModel.OldPassword, passwordModel.NewPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
                return BadRequest(ModelState);
            }

            await signInManager.RefreshSignInAsync(user);

            return NoContent();
        }
    }
}