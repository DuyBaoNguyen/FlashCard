using System.Collections.Generic;
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
	public class PublicCardsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly IImageService imageService;

		public PublicCardsController(IRepositoryWrapper repository, IImageService imageService)
		{
			this.repository = repository;
			this.imageService = imageService;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetAllPublicCards()
		{
			var publicCards = await repository.Card
				.QueryByBeingApproved()
				.AsNoTracking()
				.MapToCardDto(imageService.GetBackImageBaseUrl())
				.ToListAsync();
			return publicCards;
		}
	}
}