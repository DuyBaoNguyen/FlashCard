using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class ShortcutsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly IImageService imageService;

		public ShortcutsController(IRepositoryWrapper repository, IImageService imageService)
		{
			this.repository = repository;
			this.imageService = imageService;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<ActionResult<IEnumerable<DeckDto>>> GetAllShortcuts(string name)
		{
			var userId = UserUtil.GetUserId(User);
			var sharedDecks = await repository.Deck
				.QueryByBeingShared(userId, name)
				.AsNoTracking()
				.MapToDeckDto(imageService.UserPictureBaseUrl, userId)
				.ToListAsync();

			var now = DateTime.Now;
			foreach (var deck in sharedDecks)
			{
				if (deck.LastTestedTime != null) {
					deck.LastTestedTime = DateTimeUtil.GetDuration(DateTime.Parse(deck.LastTestedTime), now);
				}
				if (deck.Owner.Id != userId)
				{
					var sharedDeck = await repository.SharedDeck
						.QueryByUserIdAndDeckId(userId, deck.Id)
						.FirstOrDefaultAsync();
					deck.Completed = sharedDeck?.Completed ?? false;

					var sharedCards = await repository.SharedCard
						.QueryByUserIdAndDeckId(userId, deck.Id)
						.ToListAsync();
					deck.TotalSucceededCards = sharedCards.Count(s => s.Remembered);
					deck.TotalFailedCards = deck.TotalCards - deck.TotalSucceededCards;
				}
			}

			return sharedDecks;
		}

		[HttpDelete("{deckId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DeleteShortcut(int deckId)
		{
			var userId = UserUtil.GetUserId(User);
			var sharedDeck = await repository.SharedDeck
				.QueryByUserIdAndDeckIdAndBeingPinned(userId, deckId)
				.FirstOrDefaultAsync();
			
			if (sharedDeck == null)
			{
				return NotFound();
			}

			sharedDeck.Pinned = false;
			await repository.SaveChangesAsync();

			return NoContent();
		}
	}
}