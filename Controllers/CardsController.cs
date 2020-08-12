using System;
using System.Collections.Generic;
using System.Linq;
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
using Microsoft.Extensions.Logging;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class CardsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;
		private readonly ILogger<CardsController> logger;

		public CardsController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService, ILogger<CardsController> logger)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
			this.logger = logger;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<IEnumerable<CardDto>> GetAllCards(string front)
		{
			var userId = UserUtil.GetUserId(User);
			var cards = await repository.Card
				.Query(userId, front)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			return cards;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<CardDto>> GetCardById(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var card = await repository.Card
				.QueryById(userId, id)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}

			return card;
		}

		[HttpPost]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> Create(CardRequestModel cardRqModel)
		{
			var user = await userManager.GetUser(User);
			var cardSameFront = await repository.Card
				.QueryByFront(user.Id, cardRqModel.Front)
				.FirstOrDefaultAsync();

			if (cardSameFront != null && (!cardSameFront.Public || cardSameFront.Approved))
			{
				ModelState.AddModelError("Front", "The front is taken.");
				return BadRequest(ModelState);
			}

            var userIsAdmin = await userManager.CheckAdminRole(user);
			var now = DateTime.Now;
			
			if (cardSameFront == null)
			{
				cardSameFront = new Card()
				{
					Front = cardRqModel.Front.Trim(),
					Public = userIsAdmin,
					Approved = userIsAdmin,
					CreatedDate = now,
					LastModifiedDate = now,
					OwnerId = user.Id,
					AuthorId = user.Id
				};
				repository.Card.Create(cardSameFront);
			}
			else
			{
				cardSameFront.Front = cardRqModel.Front.Trim();
				cardSameFront.Public = true;
				cardSameFront.Approved = true;
				cardSameFront.CreatedDate = now;
				cardSameFront.LastModifiedDate = now;
			}

			await repository.SaveChangesAsync();

			return CreatedAtAction(nameof(GetCardById), new { Id = cardSameFront.Id },
				new { Message = "Created Successfully.", Id = cardSameFront.Id });
		}

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Update(int id, CardRequestModel cardRqModel)
		{
			var user = await userManager.GetUser(User);
			var existingCard = await repository.Card
				.QueryById(user.Id, id)
				.FirstOrDefaultAsync();

			if (existingCard == null)
			{
				return NotFound();
			}

			var cardSameFront = await repository.Card
				.QueryByFront(user.Id, cardRqModel.Front)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (cardSameFront != null && cardSameFront.Id != existingCard.Id)
			{
				ModelState.AddModelError("Front", "The front is taken.");
				return BadRequest(ModelState);
			}

			var notChanged = existingCard.Front.ToLower() == cardRqModel.Front.Trim().ToLower();

			existingCard.Front = cardRqModel.Front.Trim();
			existingCard.LastModifiedDate = DateTime.Now;

			var decks = await repository.Deck
				.QueryByCardId(existingCard.Id)
				.ToListAsync();
			var userIsAdmin = await userManager.CheckAdminRole(user);
			foreach (var deck in decks)
			{
				deck.Approved = deck.Approved && (userIsAdmin || notChanged);
			}

			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Delete(int id)
		{
			var user = await userManager.GetUser(User);
			var existingCard = await repository.Card
				.QueryByIdIncludesBacks(user.Id, id)
				.FirstOrDefaultAsync();

			if (existingCard == null)
			{
				return NotFound();
			}

			var userIsAdmin = await userManager.CheckAdminRole(user);
			var rootBackIds = existingCard.Backs
				.Where(b => b.Public == b.Approved)
				.Select(b => b.Id)
				.ToArray();
			var derivedBacks = await repository.Back
				.QueryBySourceId(rootBackIds)
				.ToListAsync();

			foreach (var derivedBack in derivedBacks)
			{
				derivedBack.SourceId = null;
			}

			if (userIsAdmin && existingCard.Backs.Any(b => b.Public != b.Approved))
			{
				existingCard.Approved = false;
				foreach (var back in existingCard.Backs)
				{
					if (back.Approved)
					{
						repository.Back.Delete(back);
					}
				}
			}
			else
			{
				var derivedCards = await repository.Card
					.QueryBySourceId(existingCard.Id)
					.ToListAsync();

				foreach (var derivedCard in derivedCards)
				{
					derivedCard.SourceId = null;
				}

				repository.Card.Delete(existingCard);
			}

			await repository.SaveChangesAsync();

			foreach (var back in existingCard.Backs)
			{
				if (back.Public == back.Approved && back.Image != null)
				{
					if (!imageService.TryDeleteImage(back.Image, ImageType.Image))
					{
						logger.LogError("An error occurs when deleting the image with name {0}", back.Image);
					}
				}
			}

			return NoContent();
		}

		[HttpPost("{id}/backs")]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> CreateBack(int id, [FromForm] BackRequestModel backRqModel)
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

			var user = await UserUtil.GetUser(userManager, User);
			var card = await repository.Card
				.QueryById(user.Id, id)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}

			var imageName = await imageService.UploadImage(backRqModel.Image, ImageType.Image);
			var userIsAdmin = await userManager.IsInRoleAsync(user, Roles.Administrator);
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
				Public = userIsAdmin,
				Approved = userIsAdmin,
				CreatedDate = now,
				LastModifiedDate = now,
				Card = card,
				Author = user
			};

			repository.Back.Create(newBack);

			var decks = await repository.Deck
				.QueryByCardId(card.Id)
				.ToListAsync();
			foreach (var deck in decks)
			{
				deck.Approved = deck.Approved && userIsAdmin;
			}

			await repository.SaveChangesAsync();

			return CreatedAtAction("GetBack", "Backs", new { Id = newBack.Id },
				new { Message = "Created Successfully.", Id = newBack.Id });
		}
	}
}