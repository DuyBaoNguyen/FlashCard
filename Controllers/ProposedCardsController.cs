using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class ProposedCardsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;

		public ProposedCardsController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(201)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<ProposedCardDto>> GetProposedCardById(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var card = await repository.Card
				.QueryById(admin.Id, id)
				.AsNoTracking()
				.MapToProposedCardDto(userId, imageService.BackImageBaseUrl, imageService.UserPictureBaseUrl)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}
			return card;
		}

		[HttpPost]
		[ProducesResponseType(200)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> ProposeCard([FromForm] ProposedCardRequestModel cardRqModel)
		{
			if (cardRqModel.Image != null)
			{
				if (cardRqModel.Image.Length > 5242880)
				{
					ModelState.AddModelError("Image", "File is not exceeded 5MB.");
				}
				if (!ImageUtil.CheckExtensions(cardRqModel.Image))
				{
					ModelState.AddModelError("Image",
						"Accepted images that images are with an extension of .png, .jpg, .jpeg or .bmp.");
				}
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
			}

			var admin = await userManager.GetAdmin();
			var card = await repository.Card
				.QueryByFront(admin.Id, cardRqModel.Front)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			var userId = UserUtil.GetUserId(User);
			var now = DateTime.Now;

			if (card == null)
			{
				card = new Card()
				{
					Front = cardRqModel.Front.Trim(),
					Public = true,
					Approved = false,
					CreatedDate = now,
					LastModifiedDate = now,
					Owner = admin,
					AuthorId = userId
				};
				repository.Card.Create(card);
				await repository.SaveChangesAsync();
			}

			var imageName = await imageService.UploadImage(cardRqModel.Image, ImageType.Image);
			var newBack = new Back()
			{
				Type = cardRqModel.Type == null || cardRqModel.Type.Trim().Length == 0
					? null : cardRqModel.Type.Trim().ToLower(),
				Meaning = cardRqModel.Meaning == null || cardRqModel.Meaning.Trim().Length == 0
					? null : cardRqModel.Meaning.Trim(),
				Example = cardRqModel.Example == null || cardRqModel.Example.Trim().Length == 0
					? null : cardRqModel.Example.Trim(),
				Image = imageName,
				Public = true,
				Approved = false,
				CreatedDate = now,
				LastModifiedDate = now,
				CardId = card.Id,
				AuthorId = userId
			};
			repository.Back.Create(newBack);

			await repository.SaveChangesAsync();

			return Ok();
		}

		[HttpPost("{id}/backs")]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> ProposeBack(int id, [FromForm] BackRequestModel backRqModel)
		{
			if (backRqModel.Image != null)
			{
				if (backRqModel.Image.Length > 5242880)
				{
					ModelState.AddModelError("Image", "File is not exceeded 5MB.");
				}
				if (!ImageUtil.CheckExtensions(backRqModel.Image))
				{
					ModelState.AddModelError("Image",
						"Accepted images that images are with an extension of .png, .jpg, .jpeg or .bmp.");
				}
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
			}
			// if ((backRqModel.Meaning == null || backRqModel.Meaning.Length == 0)
			// 	&& (backRqModel.Image == null || backRqModel.Image.Length == 0))
			// {
			// 	ModelState.AddModelError("", "Card must at least have either meaning or image.");
			// }
			// if (!ModelState.IsValid)
			// {
			// 	return BadRequest(ModelState);
			// }

			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var card = await repository.Card
				.QueryById(admin.Id, id)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}

			var imageName = await imageService.UploadImage(backRqModel.Image, ImageType.Image);
			var now = DateTime.Now;
			var newBack = new Back()
			{
				Type = backRqModel.Type == null || backRqModel.Type.Trim().Length == 0
					? null : backRqModel.Type.Trim().ToLower(),
				Meaning = backRqModel.Meaning == null || backRqModel.Meaning.Trim().Length == 0
					? null : backRqModel.Meaning.Trim(),
				Example = backRqModel.Example == null || backRqModel.Example.Trim().Length == 0
					? null : backRqModel.Example.Trim(),
				Image = imageName,
				Public = true,
				Approved = false,
				CreatedDate = now,
				LastModifiedDate = now,
				Card = card,
				AuthorId = userId
			};

			repository.Back.Create(newBack);
			await repository.SaveChangesAsync();

			return CreatedAtAction("GetProposedBackById", "ProposedBacks", new { Id = newBack.Id },
				new { Message = "Created Successfully.", Id = newBack.Id });
		}
	}
}