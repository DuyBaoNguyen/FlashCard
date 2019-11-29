using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FlashCard.ApiModels;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

        public static string GetUserId(ClaimsPrincipal principal)
        {
            return principal.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        public async static Task<ApplicationUser> GetAdmin(ApplicationDbContext dbContext)
        {
            var adminRoleId = (await dbContext.UserRoles.FirstAsync(ur => 
                                    ur.RoleId == dbContext.Roles.First(r => r.Name == Roles.Administrator).Id)).UserId;

            return await dbContext.Users.FindAsync(adminRoleId);
        }
    }
}