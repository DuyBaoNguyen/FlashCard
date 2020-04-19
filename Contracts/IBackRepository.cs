using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface IBackRepository : IRepositoryBase<Back>
	{
		IQueryable<Back> QueryById(string userId, int backId);
	}
}