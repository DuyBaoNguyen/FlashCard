using System.Collections.Generic;
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
	public class UserPublicDecksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;

		public UserPublicDecksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<ActionResult<IEnumerable<PublicDeckDto>>> GetAllUserPublicDecks()
		{
			var admin = await userManager.GetAdmin();
			var publicDecks = await repository.Deck
				.QueryByBeingApprovedAndNotAdmin(admin.Id)
				.AsNoTracking()
				.MapToPublicDeckDto()
				.ToListAsync();

			return publicDecks;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<PublicDeckDto>> GetUserPublicDeck(int id)
		{
			var admin = await userManager.GetAdmin();
			var publicDeck = await repository.Deck
				.QueryByIdAndBeingApprovedAndNotAdmin(admin.Id, id)
				.AsNoTracking()
				.MapToPublicDeckDto()
				.FirstOrDefaultAsync();

			if (publicDeck == null)
			{
				return NotFound();
			}

			return publicDeck;
		}
	}
}