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

		public IQueryable<Card> Query(string userId, string front)
		{
			if (front == null || front.Length == 0)
			{
				return dbContext.Cards
					.Where(c => c.OwnerId == userId && (!c.Public || c.Approved))
					.OrderBy(c => c.Front);
			}

			return dbContext.Cards
				.Where(c => c.OwnerId == userId && (!c.Public || c.Approved)
					&& c.Front.ToLower().Contains(front.ToLower()))
				.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryIncludesBacks(string userId)
		{
			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => c.OwnerId == userId && (!c.Public || c.Approved));
		}

		public IQueryable<Card> QueryById(string userId, int cardId)
		{
			return dbContext.Cards.Where(c => c.OwnerId == userId && c.Id == cardId);
		}

		public IQueryable<Card> QueryByIdIncludesBacks(int cardId)
		{
			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => c.Id == cardId);
		}

		public IQueryable<Card> QueryByIdIncludesBacks(string userId, int cardId)
		{
			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => c.Id == cardId && c.OwnerId == userId);
		}

		public IQueryable<Card> QueryByFront(string userId, string front)
		{
			return dbContext.Cards.Where(c => c.OwnerId == userId && c.Front.ToLower() == front.Trim().ToLower());
		}

		public IQueryable<Card> QueryByFrontIncludesBacks(string userId, string front)
		{
			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => c.OwnerId == userId && c.Front.ToLower() == front.Trim().ToLower());
		}

		public IQueryable<Card> QueryByFrontsIncludesBacks(string userId, string[] fronts)
		{
			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => c.OwnerId == userId && fronts.Contains(c.Front.ToLower()));
		}

		public IQueryable<Card> QueryByDeckId(int deckId, string front)
		{
			var queryCardIds = dbContext.CardAssignments
				.Where(ca => ca.DeckId == deckId)
				.Select(ca => ca.CardId);

			if (front == null || front.Length == 0)
			{
				return dbContext.Cards
					.Where(c => queryCardIds.Contains(c.Id))
					.OrderBy(c => c.Front);
			}

			return dbContext.Cards
					.Where(c => queryCardIds.Contains(c.Id) && c.Front.ToLower().Contains(front.ToLower()))
					.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryByDeckIdIncludesBacks(int deckId)
		{
			var queryCardIds = dbContext.CardAssignments
				.Where(ca => ca.DeckId == deckId)
				.Select(ca => ca.CardId);

			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => queryCardIds.Contains(c.Id))
				.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryRemainingByDeckId(string userId, int deckId, string front)
		{
			var queryCardIds = dbContext.CardAssignments
				.Where(c => c.DeckId == deckId)
				.Select(c => c.CardId);

			if (front == null || front.Length == 0)
			{
				return dbContext.Cards
				.Where(c => c.OwnerId == userId && !queryCardIds.Contains(c.Id))
				.OrderBy(c => c.Front);
			}

			return dbContext.Cards
				.Where(c => c.OwnerId == userId && !queryCardIds.Contains(c.Id) &&
					c.Front.ToLower().Contains(front.ToLower()))
				.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryByBeingApproved(string front)
		{
			if (front == null || front.Length == 0)
			{
				return dbContext.Cards
					.Where(c => c.Approved)
					.OrderBy(c => c.Front);
			}

			return dbContext.Cards
				.Where(c => c.Approved && c.Front.ToLower().Contains(front.ToLower()))
				.OrderBy(c => c.Front);
		}

		public IQueryable<Card> QueryByBeingApprovedIncludesBacks()
		{
			return dbContext.Cards
				.Include(c => c.Backs)
				.Where(c => c.Approved);
		}
	}
}