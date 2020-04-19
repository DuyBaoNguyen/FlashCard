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

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class DecksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;

		public DecksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<IEnumerable<DeckDto>> GetAllDecks()
		{
			var userId = UserUtil.GetUserId(User);
			var decks = await repository.Deck
				.Query(userId)
				.AsNoTracking()
				.MapToDeckDto()
				.ToListAsync();

			return decks;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<DeckDto>> GetDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.MapToDeckDto()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			return deck;
		}

		[HttpGet("{id}/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOfDeck(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdCheckingSharedDeck(userId, id)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.QueryByDeckId(id)
				.AsNoTracking()
				.MapToCardDto(imageService.GetBackImageBaseUrl())
				.ToListAsync();

			return cards;
		}

		[HttpPost]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> Create(DeckRequestModel deckRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var countSameName = await repository.Deck
				.QueryByName(userId, deckRqModel.Name)
				.CountAsync();

			if (countSameName > 0)
			{
				ModelState.AddModelError("Name", "The deck name is taken.");
				return BadRequest(ModelState);
			}

			var now = DateTime.Now;
			var newDeck = new Deck()
			{
				Name = deckRqModel.Name.Trim(),
				Description = deckRqModel.Description == null || deckRqModel.Description.Trim().Length == 0
					? null : deckRqModel.Description.Trim(),
				CreatedDate = now,
				LastModifiedDate = now,
				OwnerId = userId,
				AuthorId = userId
			};

			repository.Deck.Create(newDeck);
			await repository.SaveChangesAsync();

			return CreatedAtAction(nameof(GetDeck), new { Id = newDeck.Id },
				new { Message = "Created Successfully", Id = newDeck.Id });
		}

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Update(int id, DeckRequestModel deckRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var existingDeck = await repository.Deck
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (existingDeck == null)
			{
				return NotFound();
			}

			var deckSameName = await repository.Deck
				.QueryByName(userId, deckRqModel.Name)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (deckSameName != null && deckSameName.Id != existingDeck.Id)
			{
				ModelState.AddModelError("Name", "The deck name is taken.");
				return BadRequest(ModelState);
			}

			existingDeck.Name = deckRqModel.Name.Trim();
			existingDeck.Description = deckRqModel.Description == null || deckRqModel.Description.Trim().Length == 0
				? null : deckRqModel.Description.Trim();
			existingDeck.LastModifiedDate = DateTime.Now;

			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{id}/public")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> UpdateStatus(int id, BoolValueRequestModel valueRqModel)
		{
			var user = await UserUtil.GetUser(userManager, User);
			var deck = await repository.Deck
				.QueryById(user.Id, id)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var userIsAdmin = await userManager.IsInRoleAsync(user, Roles.Administrator);

			deck.Public = valueRqModel.Value;
			deck.Approved = valueRqModel.Value && (userIsAdmin || deck.Approved);

			await repository.SaveChangesAsync();
			return NoContent();
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Delete(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var existingDeck = await repository.Deck
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (existingDeck == null)
			{
				return NotFound();
			}

			repository.Deck.Delete(existingDeck);
			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{deckId}/cards/{cardId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> AddCardToDeck(int deckId, int cardId)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdIncludesCardAssignments(userId, deckId)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var card = await repository.Card
				.QueryById(userId, cardId)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}
			if (deck.CardAssignments.Any(ca => ca.CardId == cardId))
			{
				return NoContent();
			}

			deck.CardAssignments.Add(new CardAssignment() { Card = card });
			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{deckId}/cards/{cardId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> RemoveCardFromDeck(int deckId, int cardId)
		{
			var userId = UserUtil.GetUserId(User);
			var deck = await repository.Deck
				.QueryByIdIncludesCardAssignments(userId, deckId)
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}

			var countCard = await repository.Card
				.QueryById(userId, cardId)
				.AsNoTracking()
				.CountAsync();

			if (countCard == 0)
			{
				return NotFound();
			}

			var cardAssignment = deck.CardAssignments.FirstOrDefault(ca => ca.CardId == cardId);
			if (cardAssignment != null)
			{
				deck.CardAssignments.Remove(cardAssignment);
				await repository.SaveChangesAsync();
			}

			return NoContent();
		}
	}
}