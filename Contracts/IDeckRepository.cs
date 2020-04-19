using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface IDeckRepository : IRepositoryBase<Deck>
	{
		IQueryable<Deck> Query(string userId);
		IQueryable<Deck> QueryById(string userId, int deckId);
		IQueryable<Deck> QueryByIdCheckingSharedDeck(string userId, int deckId);
		IQueryable<Deck> QueryByIdIncludesCardAssignments(string userId, int deckId);
		IQueryable<Deck> QueryByName(string userId, string deckName);
	}
}