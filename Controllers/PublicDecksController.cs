using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
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
	public class PublicDecksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;

		public PublicDecksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<ActionResult<IEnumerable<PublicDeckDto>>> GetAllPublicDecks()
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var publicDecks = await repository.Deck
				.QueryByBeingApproved(admin.Id)
				.AsNoTracking()
				.MapToPublicDeckDto()
				.ToListAsync();
			var deckWithSourceIds = await repository.Deck
				.QueryByHavingSource(userId)
				.AsNoTracking()
				.MapToDeckWithSourceId()
				.ToDictionaryAsync(d => d.SourceId, d => d.Id);

			foreach (var publicDeck in publicDecks)
			{
				publicDeck.LocalDeckId = deckWithSourceIds.GetValueOrDefault(publicDeck.Id);
			}

			return publicDecks;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<PublicDeckDto>> GetPublicDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var publicDeck = await repository.Deck
				.QueryByIdAndBeingApproved(admin.Id, id)
				.AsNoTracking()
				.MapToPublicDeckDto()
				.FirstOrDefaultAsync();

			if (publicDeck == null)
			{
				return NotFound();
			}

			var derivedDeck = await repository.Deck
				.QueryBySourceId(userId, publicDeck.Id)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			publicDeck.LocalDeckId = derivedDeck?.Id;

			return publicDeck;
		}

		// [HttpGet("{id}/cards")]
		// [ProducesResponseType(200)]
		// [ProducesResponseType(404)]
		// public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOfPublicDeck(int id)
		// {
		// 	var admin = await userManager.GetAdmin();
		// 	var publicDeck = await repository.Deck
		// 		.QueryByIdAndAdminId(admin.Id, id)
		// 		.AsNoTracking()
		// 		.MapToPublicDeckDto()
		// 		.FirstOrDefaultAsync();

		// 	if (publicDeck == null)
		// 	{
		// 		return NotFound();
		// 	}

		// 	var cards = await repository.Card
		// 		.QueryByDeckId(publicDeck.Id)
		// 		.AsNoTracking()
		// 		.MapToCardDto(imageService.GetBackImageBaseUrl())
		// 		.ToListAsync();

		// 	return cards;
		// }

		[HttpPost("{id}/shortcuts")]
		[ProducesResponseType(201)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> GetShortcutFromDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var publicDeck = await repository.Deck
				.QueryByIdIncludesSharedDeck(id)
				.FirstOrDefaultAsync();

			if (publicDeck == null)
			{
				return NotFound();
			}

			if (!publicDeck.SharedDecks.Any(sd => sd.UserId == userId))
			{
				publicDeck.SharedDecks.Add(new SharedDeck() { UserId = userId });
				await repository.SaveChangesAsync();
			}

			return CreatedAtAction("GetDeck", "Decks", new { Id = id },
				new { Message = "Created Successfully.", Id = id });
		}
	}
}