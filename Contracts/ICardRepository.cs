using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface ICardRepository : IRepositoryBase<Card>
	{
		IQueryable<Card> Query(string userId, string front = null);
		IQueryable<Card> QueryIncludesBacks(string userId);
		IQueryable<Card> QueryById(string userId, int cardId);
		IQueryable<Card> QueryByIdIncludesBacks(int cardId);
		IQueryable<Card> QueryByIdIncludesBacks(string userId, int cardId);
		IQueryable<Card> QueryByFront(string userId, string front);
		IQueryable<Card> QueryByFrontIncludesBacks(string userId, string front);
		IQueryable<Card> QueryByFrontsIncludesBacks(string userId, string[] front);
		IQueryable<Card> QueryByDeckId(int deckId, string front = null, bool? remembered = null);
		IQueryable<Card> QueryByDeckIdIncludesBacks(int deckId);
		IQueryable<Card> QueryRemainingByDeckId(string userId, int deckId, string front = null);
		IQueryable<Card> QueryByBeingApproved(string front = null);
		IQueryable<Card> QueryByBeingApprovedIncludesBacks();
	}
}