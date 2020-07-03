using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;

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
    }
}