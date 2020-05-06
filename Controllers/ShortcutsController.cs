using System.Collections.Generic;
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
				.MapToDeckDto()
				.ToListAsync();

			return sharedDecks;
		}
	}
}