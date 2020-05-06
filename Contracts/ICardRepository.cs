using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
	public interface ICardRepository : IRepositoryBase<Card>
	{
		IQueryable<Card> Query(string userId);
		IQueryable<Card> QueryById(string userId, int cardId);
		IQueryable<Card> QueryByIdIncludesBacks(int cardId);
		IQueryable<Card> QueryByIdIncludesBacks(string userId, int cardId);
		IQueryable<Card> QueryByFront(string userId, string front);
		IQueryable<Card> QueryByFrontIncludesBacks(string userId, string front);
		IQueryable<Card> QueryByFrontsIncludesBacks(string userId, string[] front);
		IQueryable<Card> QueryByDeckId(int deckId);
		IQueryable<Card> QueryByDeckIdIncludesBacks(int deckId);
		IQueryable<Card> QueryRemainingByDeckId(string userId, int deckId);
		IQueryable<Card> QueryByBeingApproved();
		IQueryable<Card> QueryByBeingApprovedIncludesBacks();
	}
}