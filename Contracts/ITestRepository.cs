using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface ITestRepository : IRepositoryBase<Test>
	{
		IQueryable<Test> QueryIncludesTestedCards(string userId);
		IQueryable<Test> QueryByDeckIdIncludesTestedCards(string userId, int deckId);
	}
}