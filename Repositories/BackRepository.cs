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

		public IQueryable<Back> QueryByBeingNotApproved(string userId, int backId)
		{
			return dbContext.Backs.Where(b => b.Id == backId && b.Public != b.Approved && b.Card.OwnerId == userId);
		}

		public IQueryable<Back> QueryByBeingNotApproved(string userId, int[] backIds)
		{
			return dbContext.Backs.Where(b => backIds.Contains(b.Id) && b.Public != b.Approved && 
				b.Card.OwnerId == userId);
		}

		public IQueryable<Back> QueryBySourceId(int backId)
		{
			return dbContext.Backs.Where(b => b.SourceId == backId);
		}

		public IQueryable<Back> QueryBySourceId(int[] backIds)
		{
			return dbContext.Backs.Where(b => b.SourceId != null && backIds.Contains(b.SourceId.Value));
		}
	}
}