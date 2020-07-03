using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
    public interface ISharedDeckRepository : IRepositoryBase<SharedDeck>
    {
        IQueryable<SharedDeck> QueryByUserIdAndDeckId(string userId, int deckId);
    }
}