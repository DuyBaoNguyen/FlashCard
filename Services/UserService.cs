using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FlashCard.ApiModels;
using FlashCard.Models;
using Microsoft.AspNetCore.Identity;

namespace FlashCard.Services
{
    public class UserService
    {
        public async static Task<ApplicationUser> GetUser(UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
        {
            var claim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (claim != null)
            {
                return await userManager.FindByIdAsync(claim.Value);
            }
            return null;
        }
    }
}