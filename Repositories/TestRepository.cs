using System;
using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Repositories
{
	public class TestRepository : RepositoryBase<Test>, ITestRepository
	{
		public TestRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<Test> QueryIncludesTestedCards(string userId, DateTime[] dates)
		{
			return dbContext.Tests
				.Include(t => t.TestedCards)
					.ThenInclude(tc => tc.Card)
				.Include(t => t.Deck)
				.Where(t => t.TakerId == userId && dates.Contains(t.DateTime.Date))
				.OrderByDescending(t => t.DateTime);
		}

		public IQueryable<Test> QueryByDeckIdIncludesTestedCards(string userId, int deckId, DateTime[] dates)
		{
			return dbContext.Tests
				.Include(t => t.TestedCards)
					.ThenInclude(tc => tc.Card)
				.Include(t => t.Deck)
				.Where(t => t.TakerId == userId && t.DeckId == deckId && dates.Contains(t.DateTime.Date))
				.OrderByDescending(t => t.DateTime);
		}
	}
}