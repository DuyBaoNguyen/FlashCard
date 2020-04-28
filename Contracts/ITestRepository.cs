using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface ITestRepository : IRepositoryBase<Test>
	{
		IQueryable<Test> QueryIncludesTestedCards(string userId);
		IQueryable<Test> QueryByDeckIdIncludesTestedCards(string userId, int deckId);
	}
}