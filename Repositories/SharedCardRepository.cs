using System;
using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Repositories
{
    public class SharedCardRepository : RepositoryBase<SharedCard>, ISharedCardRepository
    {
        public SharedCardRepository(ApplicationDbContext dbContext) : base(dbContext)
        {

        }

        public IQueryable<SharedCard> QueryByUserIdAndDeckId(string userId, int deckId)
        {
            var queryCardIds = dbContext.CardAssignments
                .Where(ca => ca.DeckId == deckId)
                .Select(ca => ca.CardId);
            return dbContext.SharedCards.Where(s => s.UserId == userId && queryCardIds.Contains(s.CardId));
        }

        public IQueryable<SharedCard> QueryByFirstRememberedDate(string userId, int deckId, DateTime[] dates)
        {
            var queryCardIds = dbContext.CardAssignments
                .Where(ca => ca.DeckId == deckId)
                .Select(ca => ca.CardId);

            return dbContext.SharedCards
                .Where(sc => sc.UserId == userId && sc.FirstRememberedDate != null &&
                    queryCardIds.Contains(sc.CardId) && dates.Contains(sc.FirstRememberedDate.Value.Date));
        }

        public IQueryable<SharedCard> QueryByFirstRememberedDate(string userId, DateTime[] dates)
        {
            return dbContext.SharedCards
                .Where(sc => sc.UserId == userId && sc.FirstRememberedDate != null &&
                    dates.Contains(sc.FirstRememberedDate.Value.Date));
        }
    }
}