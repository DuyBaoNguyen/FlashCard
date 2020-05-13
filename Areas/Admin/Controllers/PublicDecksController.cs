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

namespace FlashCard.Areas.Admin.Controllers
{
	[Authorize]
	[Route("api/admin/[controller]")]
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
		[ProducesResponseType(403)]
		public async Task<ActionResult<IEnumerable<DeckDto>>> GetAllPublicDecks()
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var notApprovedDecks = await repository.Deck
				.QueryByBeingNotApproved()
				.AsNoTracking()
				.MapToDeckDto()
				.ToListAsync();

			return notApprovedDecks;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<DeckDto>> GetPublicDeck(int id)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var notApprovedDeck = await repository.Deck
				.QueryByIdAndBeingNotApproved(id)
				.AsNoTracking()
				.MapToDeckDto()
				.FirstOrDefaultAsync();

			if (notApprovedDeck == null)
			{
				return NotFound();
			}

			return notApprovedDeck;
		}

		[HttpGet("{id}/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOfPublicDeck(int id)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var notApprovedDeck = await repository.Deck
				.QueryByIdAndBeingNotApproved(id)
				.AsNoTracking()
				.MapToDeckDto()
				.FirstOrDefaultAsync();

			if (notApprovedDeck == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.QueryByDeckId(notApprovedDeck.Id)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			return cards;
		}

		[HttpPut("{id}/approved")]
		[ProducesResponseType(204)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> UpdatePublicDeckStatus(int id, BoolValueRequestModel valueRqModel)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var notApprovedDeck = await repository.Deck
				.QueryByIdAndBeingNotApproved(id)
				.FirstOrDefaultAsync();

			if (notApprovedDeck == null)
			{
				return NotFound();
			}

			notApprovedDeck.Approved = valueRqModel.Value;
			notApprovedDeck.Public = valueRqModel.Value;
			await repository.SaveChangesAsync();

			return NoContent();
		}
	}
}