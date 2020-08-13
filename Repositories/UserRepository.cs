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

		public IQueryable<ApplicationUser> QueryByBeingNotAdmin(string adminId, string search)
		{
			var queryUsers = dbContext.Users.Where(u => u.Id != adminId);

			if (search != null && search.Trim().Length > 0)
			{
				queryUsers = queryUsers.Where(u => u.Name.Contains(search) || u.Email.Contains(search));
			}
			return queryUsers.OrderBy(u => u.Name);
		}

		public IQueryable<ApplicationUser> QueryByIdAndNotAdmin(string adminId, string userId)
		{
			return dbContext.Users.Where(u => u.Id == userId && u.Id != adminId);
		}
	}
}