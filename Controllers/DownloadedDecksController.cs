using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Models;
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
	public class DownloadedDecksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly IImageService imageService;
		private readonly ILogger<DownloadedDecksController> logger;
		private UserManager<ApplicationUser> userManager;

		public DownloadedDecksController(IRepositoryWrapper repository, IImageService imageService,
			ILogger<DownloadedDecksController> logger, UserManager<ApplicationUser> userManager)
		{
			this.repository = repository;
			this.imageService = imageService;
			this.logger = logger;
			this.userManager = userManager;
		}

		[HttpPut("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DownloadDeck(int id)
		{
			var admin = await userManager.GetAdmin();
			var publicDeck = await repository.Deck
				.QueryByIdAndBeingApproved(admin.Id, id)
				.FirstOrDefaultAsync();

			if (publicDeck == null)
			{
				return NotFound();
			}

			var userId = UserUtil.GetUserId(User);
			var ownedDeck = await repository.Deck
				.QueryBySourceId(userId, publicDeck.Id)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (ownedDeck != null)
			{
				return Ok();
			}

			var allDeckNames = repository.Deck
				.Query(userId)
				.Select(d => d.Name)
				.ToHashSet();
			var newDeckName = GetDeckName(allDeckNames, publicDeck.Name);
			var newDeck = new Deck()
			{
				Name = newDeckName,
				Description = publicDeck.Description,
				CreatedDate = publicDeck.CreatedDate,
				LastModifiedDate = publicDeck.LastModifiedDate,
				OwnerId = userId,
				AuthorId = publicDeck.AuthorId,
				Source = publicDeck,
				CardAssignments = new List<CardAssignment>()
			};
			repository.Deck.Create(newDeck);

			var publicCards = await repository.Card
				.QueryByDeckIdIncludesBacks(publicDeck.Id)
				.ToListAsync();
			var publicFronts = publicCards.Select(c => c.Front.ToLower()).ToArray();
			var ownedCards = await repository.Card
				.QueryByFrontsIncludesBacks(userId, publicFronts)
				.ToListAsync();
			var cardsOfDeck = new List<Card>();

			foreach (var publicCard in publicCards)
			{
				var ownedCard = ownedCards.FirstOrDefault(c => c.Front.ToLower() == publicCard.Front.ToLower());

				if (ownedCard == null)
				{
					ownedCard = new Card()
					{
						Front = publicCard.Front,
						CreatedDate = publicCard.CreatedDate,
						LastModifiedDate = publicCard.LastModifiedDate,
						OwnerId = userId,
						AuthorId = publicCard.AuthorId,
						Backs = new List<Back>()
					};
					repository.Card.Create(ownedCard);
				}
				cardsOfDeck.Add(ownedCard);

				if (ownedCard.SourceId == null)
				{
					ownedCard.Source = publicCard;
				}

				foreach (var publicBack in publicCard.Backs)
				{
					if (!ownedCard.Backs.Any(b => b.SourceId == publicBack.Id))
					{
						var imageName = imageService.DuplicateImage(publicBack.Image);
						if (publicBack.Image != null && imageName == null)
						{
							logger.LogError("An error occurs when duplicating the image with name {0}", publicBack.Image);
						}

						ownedCard.Backs.Add(new Back()
						{
							Type = publicBack.Type,
							Meaning = publicBack.Meaning,
							Example = publicBack.Example,
							Image = imageName,
							CreatedDate = publicBack.CreatedDate,
							LastModifiedDate = publicBack.LastModifiedDate,
							SourceId = publicBack.Id,
							AuthorId = publicBack.AuthorId
						});
					}
				}
			}

			await repository.SaveChangesAsync();

			foreach (var card in cardsOfDeck)
			{
				newDeck.CardAssignments.Add(new CardAssignment() { Card = card });
			}
			await repository.SaveChangesAsync();

			return Ok(new { Message = "Downloaded Successfully.", Id = newDeck.Id });
		}

		private string GetDeckName(HashSet<string> source, string baseDeckName)
		{
			var i = 1;
			var deckName = baseDeckName;
			while (source.Contains(deckName))
			{
				deckName = $"{baseDeckName} {i++}";
			}
			return deckName;
		}
	}
}