using System.Linq;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;

namespace FlashCard.Repositories
{
    public class SharedDeckRepository : RepositoryBase<SharedDeck>, ISharedDeckRepository
    {
        public SharedDeckRepository(ApplicationDbContext dbContext) : base(dbContext)
        {

        }

        public IQueryable<SharedDeck> QueryByUserId(string userId)
        {
            return dbContext.SharedDecks.Where(s => s.UserId == userId);
        }

        public IQueryable<SharedDeck> QueryByUserIdAndDeckId(string userId, int deckId)
        {
            return dbContext.SharedDecks.Where(s => s.UserId == userId && s.DeckId == deckId);
        }

        public IQueryable<SharedDeck> QueryByUserIdAndDeckIdAndBeingPinned(string userId, int deckId)
        {
            return dbContext.SharedDecks.Where(s => s.UserId == userId && s.DeckId == deckId && s.Pinned);
        }
    }
}