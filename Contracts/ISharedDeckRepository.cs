using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
    public interface ISharedDeckRepository : IRepositoryBase<SharedDeck>
    {
        IQueryable<SharedDeck> QueryByUserId(string userId);
        IQueryable<SharedDeck> QueryByUserIdAndDeckId(string userId, int deckId);
    }
}