using System;
using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
    public interface ISharedCardRepository : IRepositoryBase<SharedCard>
    {
        IQueryable<SharedCard> QueryByUserIdAndDeckId(string userId, int deckId);
        IQueryable<SharedCard> QueryByFirstRememberedDate(string userId, int deckId, DateTime[] dates);
        IQueryable<SharedCard> QueryByFirstRememberedDate(string userId, DateTime[] dates);
    }
}