using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class CurrentUserController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> userManager;
		private readonly SignInManager<ApplicationUser> signInManager;

		public CurrentUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
		}

		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> Get()
		{
			var user = await userManager.GetUser(User);
			var roles = await userManager.GetRolesAsync(user);

			return Ok(new
			{
				Id = user.Id,
				DisplayName = user.Name,
				Email = user.Email,
				Role = roles[0],
				Image = user.Avatar
			});
		}

		[HttpPut]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> Update(UserRequestModel userRqModel)
		{
			var user = await userManager.GetUser(User);
			user.Name = userRqModel.DisplayName.Trim();

			await userManager.UpdateAsync(user);
			return NoContent();
		}

		[HttpPut("password")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> ChangePassword(PasswordRequestModel passwordRqModel)
		{
			var user = await userManager.GetUser(User);
			var result = await userManager.ChangePasswordAsync(user, passwordRqModel.OldPassword,
				passwordRqModel.NewPassword);

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