using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FlashCard.Models;
using Microsoft.AspNetCore.Identity;

namespace FlashCard.Util
{
	public static class UserUtil
	{
		public static string GetUserId(ClaimsPrincipal principal)
		{
			return principal.FindFirst(ClaimTypes.NameIdentifier).Value;
		}

		public async static Task<ApplicationUser> GetUser(this UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
		{
			var userId = GetUserId(principal);
			return await userManager.FindByIdAsync(userId);
		}

		public async static Task<ApplicationUser> GetAdmin(this UserManager<ApplicationUser> userManager)
		{
			return (await userManager.GetUsersInRoleAsync(Roles.Administrator)).FirstOrDefault();
		}
	}
}