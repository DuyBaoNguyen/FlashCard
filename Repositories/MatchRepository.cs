using System;
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

		public IQueryable<Match> QueryIncludesMatchedCards(string userId, DateTime[] dates)
		{
			return dbContext.Matches
				.Include(m => m.MatchedCards)
					.ThenInclude(mc => mc.Card)
				.Include(m => m.Deck)
				.Where(m => m.TakerId == userId && dates.Contains(m.StartTime.Date))
				.OrderByDescending(m => m.StartTime);
		}

		public IQueryable<Match> QueryByDeckIdIncludesMatchedCards(string userId, int deckId, DateTime[] dates)
		{
			return dbContext.Matches
				.Include(m => m.MatchedCards)
					.ThenInclude(mc => mc.Card)
				.Include(m => m.Deck)
				.Where(m => m.TakerId == userId && m.DeckId == deckId && dates.Contains(m.StartTime.Date))
				.OrderByDescending(m => m.StartTime);
		}
	}
}