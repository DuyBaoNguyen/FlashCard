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
		IQueryable<Deck> QueryByIdIncludesSharedDeck(int deckId);
		IQueryable<Deck> QueryByName(string userId, string deckName);
		IQueryable<Deck> QueryByBeingApprovedAndAdminId(string adminId);
		IQueryable<Deck> QueryByIdAndBeingApprovedAndAdminId(string adminId, int deckId);
		IQueryable<Deck> QueryByHavingSource(string userId);
		IQueryable<Deck> QueryBySourceId(string userId, int sourceId);
		IQueryable<Deck> QueryByBeingApprovedAndNotAdmin(string adminId);
		IQueryable<Deck> QueryByIdAndBeingApprovedAndNotAdmin(string adminId, int deckId);
		IQueryable<Deck> QueryByBeingShared(string userId);
	}
}