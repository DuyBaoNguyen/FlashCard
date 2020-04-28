using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Repositories
{
	public class CardRepository : RepositoryBase<Card>, ICardRepository
	{
		public CardRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<Card> Query(string userId)
		{
			return dbContext.Cards
				.Where(c => c.OwnerId == userId && (!c.Public || c.Approved))
				.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryById(string userId, int cardId)
		{
			return dbContext.Cards.Where(c => c.OwnerId == userId && c.Id == cardId);
		}

		public IQueryable<Card> QueryByFront(string userId, string front)
		{
			return dbContext.Cards.Where(c => c.OwnerId == userId && c.Front.ToLower() == front.Trim().ToLower());
		}

		public IQueryable<Card> QueryByDeckId(int deckId)
		{
			var queryCardIds = dbContext.CardAssignments
				.Where(ca => ca.DeckId == deckId)
				.Select(ca => ca.CardId);

			return dbContext.Cards
				.Where(c => queryCardIds.Contains(c.Id))
				.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryRemainingByDeckId(string userId, int deckId)
		{
			var queryCardIds = dbContext.CardAssignments
				.Where(c => c.DeckId == deckId)
				.Select(c => c.CardId);

			return dbContext.Cards
				.Where(c => c.OwnerId == userId && !queryCardIds.Contains(c.Id))
				.OrderBy(c => c.Front);
		}
	}
}