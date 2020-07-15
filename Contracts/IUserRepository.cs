using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface IUserRepository : IRepositoryBase<ApplicationUser>
	{
		IQueryable<ApplicationUser> QueryByBeingNotAdmin(string adminId, string search = null);
		IQueryable<ApplicationUser> QueryByIdAndNotAdmin(string adminId, string userId);
	}
}