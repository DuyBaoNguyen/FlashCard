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
	public class ProposedBacksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;

		public ProposedBacksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<ProposedBackDto>> GetProposedBackById(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var admin = await userManager.GetAdmin();
			var back = await repository.Back
				.QueryByBeingProposed(userId, admin.Id, id)
				.AsNoTracking()
				.MapToProposedBackDto(imageService.GetBackImageBaseUrl())
				.FirstOrDefaultAsync();

			if (back == null)
			{
				return NotFound();
			}
			return back;
		}
	}
}