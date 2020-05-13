using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlashCard.Areas.Admin.Controllers
{
	[Authorize]
	[Route("api/admin/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class DecksController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;

		public DecksController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager)
		{
			this.repository = repository;
			this.userManager = userManager;
		}

		// [HttpGet("")]
		// public async Task<ActionResult<DeckDto>> GetDeckOfUser(string userId, int deckId)
		// {
			
		// }
	}
}