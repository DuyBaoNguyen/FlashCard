using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
		private readonly IImageService imageService;
		private readonly ILogger<CurrentUserController> logger;

		public CurrentUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
			IImageService imageService, ILogger<CurrentUserController> logger)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
			this.imageService = imageService;
			this.logger = logger;
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
				PictureUrl = user.Picture != null ? Path.Combine(imageService.UserPictureBaseUrl, user.Picture) : null
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

		[HttpPut("picture")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> UpdatePicture([FromForm] IFormFile picture)
		{
			var user = await userManager.GetUser(User);
			if (picture != null)
			{
				if (picture.Length > 5242880)
				{
					ModelState.AddModelError("Picture", "File is not exceeded 5MB.");
				}
				if (!ImageUtil.CheckExtensions(picture))
				{
					ModelState.AddModelError("Picture",
						"Accepted images that images are with an extension of .png, .jpg, .jpeg or .bmp.");
				}
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
			}
			var oldImageName = user.Picture;
			var imageName = await imageService.UploadImage(picture, ImageType.Picture);
			if (picture != null && picture.Length > 0 && imageName == null)
			{
				ModelState.AddModelError("", "An error when uploading the image");
				return BadRequest(ModelState);
			}

			user.Picture = imageName;
			await userManager.UpdateAsync(user);

			if (!imageService.TryDeleteImage(oldImageName, ImageType.Picture))
			{
				logger.LogError("Occur an error when deleting image with name {0}", oldImageName);
			}
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