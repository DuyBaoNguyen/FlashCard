using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;

namespace FlashCard.Repositories
{
	public class BackRepository : RepositoryBase<Back>, IBackRepository
	{
		public BackRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<Back> QueryById(string userId, int backId)
		{
			return dbContext.Backs.Where(b => b.Id == backId && b.Card.OwnerId == userId);
		}

		public IQueryable<Back> QueryByBeingProposed(string userId, string adminId, int backId)
		{
			return dbContext.Backs.Where(b => b.Id == backId && b.AuthorId == userId && b.Card.OwnerId == adminId);
		}
	}
}