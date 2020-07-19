using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Models;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class DownloadedCardsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly IImageService imageService;
		private readonly ILogger<DownloadedCardsController> logger;

		public DownloadedCardsController(IRepositoryWrapper repository, IImageService imageService,
			ILogger<DownloadedCardsController> logger)
		{
			this.repository = repository;
			this.imageService = imageService;
			this.logger = logger;
		}

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DownloadPublicCard(int id)
		{
			var publicCard = await repository.Card
				.QueryByIdIncludesBacks(id)
				.FirstOrDefaultAsync();

			if (publicCard == null || !publicCard.Approved)
			{
				return NotFound();
			}

			var userId = UserUtil.GetUserId(User);
			var ownedCard = await repository.Card
				.QueryByFrontIncludesBacks(userId, publicCard.Front)
				.FirstOrDefaultAsync();

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

			if (ownedCard.SourceId == null)
			{
				ownedCard.Source = publicCard;
			}

			foreach (var publicBack in publicCard.Backs)
			{
				if (publicBack.Approved && !ownedCard.Backs.Any(b => b.SourceId == publicBack.Id))
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

			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpPost]
		[ProducesResponseType(200)]
		public async Task<IActionResult> DownloadAllPublicCards()
		{
			var publicCards = await repository.Card
				.QueryByBeingApprovedIncludesBacks()
				.ToListAsync();
			var publicFronts = publicCards.Select(c => c.Front.ToLower()).ToArray();
			var userId = UserUtil.GetUserId(User);
			var ownedCards = await repository.Card
				.QueryByFrontsIncludesBacks(userId, publicFronts)
				.ToListAsync();

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

			return NoContent();
		}
	}
}