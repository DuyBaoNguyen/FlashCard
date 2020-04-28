using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Repositories
{
	public class MatchRepository : RepositoryBase<Match>, IMatchRepository
	{
		public MatchRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<Match> QueryIncludesMatchedCards(string userId)
		{
			return dbContext.Matches
				.Include(m => m.MatchedCards)
					.ThenInclude(mc => mc.Card)
				.Include(m => m.Deck)
				.Where(m => m.TakerId == userId)
				.OrderByDescending(m => m.StartTime);
		}

		public IQueryable<Match> QueryByDeckIdIncludesMatchedCards(string userId, int deckId)
		{
			return dbContext.Matches
				.Include(m => m.MatchedCards)
					.ThenInclude(mc => mc.Card)
				.Include(m => m.Deck)
				.Where(m => m.TakerId == userId && m.DeckId == deckId)
				.OrderByDescending(m => m.StartTime);
		}
	}
}