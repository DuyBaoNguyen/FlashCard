using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
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

		public ShortcutsController(IRepositoryWrapper repository)
		{
			this.repository = repository;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<ActionResult<IEnumerable<DeckDto>>> GetAllShortcuts()
		{
			var userId = UserUtil.GetUserId(User);
			var sharedDecks = await repository.Deck
				.QueryByBeingShared(userId)
				.AsNoTracking()
				.MapToDeckDto(userId)
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
	}
}