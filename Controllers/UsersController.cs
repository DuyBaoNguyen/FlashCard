using System.Collections.Generic;
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
    public class UsersController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private ApplicationDbContext dbContext;

        public UsersController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<UserApiModel>>> GetAll()
        {
            var userId = UserService.GetUserId(User);
            var admin = await UserService.GetAdmin(dbContext);

            if (admin.Id != userId)
            {
                return Forbid();
            }

            var userModels = new List<UserApiModel>();
            var users = await dbContext.Users.ToArrayAsync();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                userModels.Add(new UserApiModel()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    DisplayName = user.Name,
                    Email = user.Email,
                    Role = roles[0],
                    Image = ImageService.GetBase64(user.Avatar, user.ImageType)
                });
            }

            return userModels;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserApiModel>> GetById(string id)
        {
            var currentUser = await UserService.GetUser(userManager, User);
            var currentUserIsInUserRole = await userManager.IsInRoleAsync(currentUser, Roles.User);

            if (currentUserIsInUserRole && currentUser.Id != id)
            {
                return Forbid();
            }

            var user = await dbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var roles = await userManager.GetRolesAsync(user);

            return new UserApiModel()
            {
                Id = user.Id,
                UserName = user.UserName,
                DisplayName = user.Name,
                Email = user.Email,
                Role = roles[0],
                Image = ImageService.GetBase64(user.Avatar, user.ImageType)
            };
        }
    }
}