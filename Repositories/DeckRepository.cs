using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Repositories
{
	public class DeckRepository : RepositoryBase<Deck>, IDeckRepository
	{
		public DeckRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<Deck> Query(string userId, string deckName)
		{
			if (deckName == null || deckName.Length == 0)
			{
				return dbContext.Decks
					.Where(d => d.OwnerId == userId)
					.OrderBy(d => d.Name);
			}
			return dbContext.Decks
				.Where(d => d.OwnerId == userId && d.Name.ToLower().Contains(deckName.ToLower()))
				.OrderBy(d => d.Name);
		}

		public IQueryable<Deck> QueryById(string userId, int deckId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.Id == deckId);
		}

		public IQueryable<Deck> QueryByIdCheckingSharedDeck(string userId, int deckId)
		{
			return dbContext.Decks
				.Where(d => d.Id == deckId && (d.OwnerId == userId || d.Approved));
		}

		public IQueryable<Deck> QueryByIdIncludesCardAssignments(string userId, int deckId)
		{
			return dbContext.Decks
				.Include(d => d.CardAssignments)
				.Where(d => d.OwnerId == userId && d.Id == deckId);
		}

		public IQueryable<Deck> QueryByName(string userId, string deckName)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.Name == deckName.Trim());
		}

		public IQueryable<Deck> QueryByBeingNotApproved()
		{
			return dbContext.Decks.Where(d => d.Public && !d.Approved);
		}

		public IQueryable<Deck> QueryByIdAndBeingNotApproved(int deckId)
		{
			return dbContext.Decks.Where(d => d.Id == deckId && d.Public && !d.Approved);
		}

		public IQueryable<Deck> QueryByBeingApproved(string adminId, string deckName)
		{
			if (deckName == null || deckName.Length == 0)
			{
				return dbContext.Decks
					.Where(d => d.OwnerId == adminId && d.Approved)
					.OrderBy(d => d.Name);
			}
			return dbContext.Decks
				.Where(d => d.OwnerId == adminId && d.Approved && d.Name.ToLower().Contains(deckName.ToLower()))
				.OrderBy(d => d.Name);
		}

		public IQueryable<Deck> QueryByIdAndBeingApproved(string adminId, int deckId)
		{
			return dbContext.Decks.Where(d => d.Id == deckId && d.OwnerId == adminId && d.Approved);
		}

		public IQueryable<Deck> QueryByHavingSource(string userId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.SourceId != null);
		}

		public IQueryable<Deck> QueryBySourceId(string userId, int sourceId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.SourceId == sourceId);
		}

		public IQueryable<Deck> QueryByBeingApprovedAndNotAdmin(string adminId)
		{
			return dbContext.Decks.Where(d => d.OwnerId != adminId && d.Approved);
		}

		public IQueryable<Deck> QueryByIdAndBeingApprovedAndNotAdmin(string adminId, int deckId)
		{
			return dbContext.Decks.Where(d => d.Id == deckId && d.OwnerId != adminId && d.Approved);
		}

		public IQueryable<Deck> QueryByIdIncludesSharedDeck(int deckId)
		{
			return dbContext.Decks
				.Include(d => d.SharedDecks)
				.Where(d => d.Id == deckId && d.Approved);
		}

		public IQueryable<Deck> QueryByBeingShared(string userId)
		{
			var querySharedDeckIds = dbContext.SharedDecks
				.Where(sd => sd.UserId == userId)
				.Select(sd => sd.DeckId);
			return dbContext.Decks.Where(d => d.Approved && querySharedDeckIds.Contains(d.Id));
		}
	}
}