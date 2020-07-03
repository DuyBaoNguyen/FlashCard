using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
    public interface ISharedCardRepository : IRepositoryBase<SharedCard>
    {
        IQueryable<SharedCard> QueryByUserIdAndDeckId(string userId, int deckId);
    }
}