using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface IBackRepository : IRepositoryBase<Back>
	{
		IQueryable<Back> QueryById(string userId, int backId);
		IQueryable<Back> QueryByBeingProposed(string userId, string adminId, int backId);
		IQueryable<Back> QueryByBeingNotApproved(string userId, int backId);
		IQueryable<Back> QueryByBeingNotApproved(string userId, int[] backIds);
	}
}