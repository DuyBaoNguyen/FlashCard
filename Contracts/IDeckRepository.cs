using System.Linq;
using System.Threading.Tasks;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface IDeckRepository : IRepositoryBase<Deck>
	{
		IQueryable<Deck> Query(string userId, string deckName = null);
		IQueryable<Deck> QueryById(string userId, int deckId);
		IQueryable<Deck> QueryByIdCheckingSharedDeck(string userId, int deckId);
		IQueryable<Deck> QueryByIdIncludesCardAssignments(string userId, int deckId);
		IQueryable<Deck> QueryByIdIncludesSharedDeck(int deckId);
		IQueryable<Deck> QueryByName(string userId, string deckName);
		IQueryable<Deck> QueryByBeingNotApproved();
		IQueryable<Deck> QueryByIdAndBeingNotApproved(int deckId);
		IQueryable<Deck> QueryByBeingApproved(string adminId, string deckName = null);
		IQueryable<Deck> QueryByIdAndBeingApproved(string adminId, int deckId);
		IQueryable<Deck> QueryByHavingSource(string userId);
		IQueryable<Deck> QueryBySourceId(string userId, int sourceId);
		IQueryable<Deck> QueryByBeingApprovedAndNotAdmin(string adminId, string deckName = null);
		IQueryable<Deck> QueryByIdAndBeingApprovedAndNotAdmin(string adminId, int deckId);
		IQueryable<Deck> QueryByBeingShared(string userId);
		IQueryable<Deck> QueryByCardIdsIncludesCardAssignmentsAndCard(int[] cardIds);
		Task LoadCards(Deck deck);
	}
}