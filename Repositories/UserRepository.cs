using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;

namespace FlashCard.Repositories
{
	public class UserRepository : RepositoryBase<ApplicationUser>, IUserRepository
	{
		public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<ApplicationUser> QueryByBeingNotAdmin(string adminId)
		{
			return dbContext.Users.Where(u => u.Id != adminId);
		}

		public IQueryable<ApplicationUser> QueryByIdAndNotAdmin(string adminId, string userId)
		{
			return dbContext.Users.Where(u => u.Id == userId && u.Id != adminId);
		}
	}
}