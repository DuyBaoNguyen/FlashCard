using System;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class ProposedBacksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;
		private readonly ILogger<ProposedBacksController> logger;

		public ProposedBacksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService, ILogger<ProposedBacksController> logger)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
			this.logger = logger;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<ProposedBackDto>> GetProposedBackById(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var back = await repository.Back
				.QueryByBeingProposed(userId, admin.Id, id)
				.AsNoTracking()
				.MapToProposedBackDto(imageService.GetBackImageBaseUrl())
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			return back;
		}

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> UpdateProposedBack(int id, BackNotImageRequestModel backRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var back = await repository.Back
				.QueryByBeingProposed(userId, admin.Id, id)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			if (back.Approved)
			{
				return Forbid();
			}
			if (back.Image == null && (backRqModel.Meaning == null || back.Meaning.Length == 0))
			{
				ModelState.AddModelError("", "Card must at least have either meaning or image.");
				return BadRequest(ModelState);
			}

			back.Type = backRqModel.Type == null || backRqModel.Type.Trim().Length == 0
				? null : backRqModel.Type.Trim().ToLower();
			back.Meaning = backRqModel.Meaning == null || backRqModel.Meaning.Trim().Length == 0
				? null : backRqModel.Meaning.Trim();
			back.Example = backRqModel.Example == null || backRqModel.Example.Trim().Length == 0
				? null : backRqModel.Example.Trim();
			back.LastModifiedDate = DateTime.Now;

			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{id}/image")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> UpdateProposedBackImage(int id, [FromForm] IFormFile image)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var back = await repository.Back
				.QueryByBeingProposed(userId, admin.Id, id)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			if (back.Approved)
			{
				return Forbid();
			}
			if (back.Meaning == null && image == null)
			{
				ModelState.AddModelError("", "Card must at least have either meaning or image.");
			}
			if (image != null)
			{
				if (image.Length > 5242880)
				{
					ModelState.AddModelError("Image", "File is not exceeded 5MB.");
				}
				if (!ImageUtil.CheckExtensions(image))
				{
					ModelState.AddModelError("Image",
						"Accepted images that images are with an extension of .png, .jpg, .jpeg or .bmp.");
				}
			}
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var oldImageName = back.Image;
			var imageName = await imageService.UploadImage(image);
			back.Image = imageName;
			back.LastModifiedDate = DateTime.Now;

			await repository.SaveChangesAsync();

			if (!imageService.TryDeleteImage(oldImageName))
			{
				logger.LogError("Occur an error when deleting image with name {0}", oldImageName);
			}

			return NoContent();
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DeleteProposedBack(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var back = await repository.Back
				.QueryByBeingProposed(userId, admin.Id, id)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}

			repository.Back.Delete(back);
			await repository.SaveChangesAsync();

			if (!imageService.TryDeleteImage(back.Image))
			{
				logger.LogError("Occur an error when deleting image with name {0}", back.Image);
			}

			return NoContent();
		}
	}
}