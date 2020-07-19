using System;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class BacksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly ILogger<BacksController> logger;
		private readonly IImageService imageService;

		public BacksController(IRepositoryWrapper repository, ILogger<BacksController> logger,
			IImageService imageService)
		{
			this.repository = repository;
			this.logger = logger;
			this.imageService = imageService;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<BackDto>> GetBack(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var back = await repository.Back
				.QueryById(userId, id)
				.AsNoTracking()
				.MapToBackDto(imageService.BackImageBaseUrl)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			return back;
		}

		// [HttpGet("{id}/image")]
		// [ProducesResponseType(200)]
		// [ProducesResponseType(404)]
		// [ResponseCache(Duration = 2592000)]
		// public async Task<IActionResult> GetBackImage(int id)
		// {
		// 	var userId = UserUtil.GetUserId(User);
		// 	var back = await repository.Back
		// 		.QueryById(userId, id)
		// 		.AsNoTracking()
		// 		.FirstOrDefaultAsync();

		// 	if (back == null)
		// 	{
		// 		return NotFound();
		// 	}

		// 	var filePath = Path.Combine(env.ContentRootPath, "assets/images", back.Image);
		// 	var stream = System.IO.File.OpenRead(filePath);
		// 	return File(stream, $"image/{Path.GetExtension(filePath).Remove(0, 1)}");
		// }

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Update(int id, BackNotImageRequestModel backRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var back = await repository.Back
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			// if (back.Image == null && (backRqModel.Meaning == null || backRqModel.Meaning.Length == 0))
			// {
			// 	ModelState.AddModelError("", "Card must at least have either meaning or image.");
			// 	return BadRequest(ModelState);
			// }

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
		[ProducesResponseType(404)]
		public async Task<IActionResult> UpdateImage(int id, [FromForm] IFormFile image)
		{
			var userId = UserUtil.GetUserId(User);
			var back = await repository.Back
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			// if (back.Meaning == null && image == null)
			// {
			// 	ModelState.AddModelError("", "Card must at least have either meaning or image.");
			// }
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
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
			}
			// if (!ModelState.IsValid)
			// {
			// 	return BadRequest(ModelState);
			// }

			var oldImageName = back.Image;
			var imageName = await imageService.UploadImage(image, ImageType.Image);
			back.Image = imageName;
			back.LastModifiedDate = DateTime.Now;

			await repository.SaveChangesAsync();

			if (!imageService.TryDeleteImage(oldImageName, ImageType.Image))
			{
				logger.LogError("Occur an error when deleting image with name {0}", oldImageName);
			}

			return NoContent();
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Delete(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var back = await repository.Back
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}

			var derivedBacks = await repository.Back
				.QueryBySourceId(back.Id)
				.ToListAsync();

			foreach (var derivedBack in derivedBacks)
			{
				derivedBack.SourceId = null;
			}

			repository.Back.Delete(back);
			await repository.SaveChangesAsync();

			if (!imageService.TryDeleteImage(back.Image, ImageType.Image))
			{
				logger.LogError("Occur an error when deleting image with name {0}", back.Image);
			}

			return NoContent();
		}
	}
}