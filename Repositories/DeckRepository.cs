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

		public IQueryable<Deck> Query(string userId)
		{
			return dbContext.Decks
				.Where(d => d.OwnerId == userId)
				.OrderBy(d => d.Name);
		}

		public IQueryable<Deck> QueryById(string userId, int deckId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.Id == deckId);
		}

		public IQueryable<Deck> QueryByIdCheckingSharedDeck(string userId, int deckId)
		{
			var query = dbContext.SharedDecks
				.Where(d => d.DeckId == deckId && d.UserId == userId)
				.Select(d => d.DeckId);

			return dbContext.Decks
				.Where(d => d.Id == deckId && (d.OwnerId == userId || d.Approved && query.Contains(d.Id)));
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
	}
}