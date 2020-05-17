using System;
using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
    public interface IMatchRepository : IRepositoryBase<Match>
    {
        IQueryable<Match> QueryIncludesMatchedCards(string userId, DateTime[] dates);
        IQueryable<Match> QueryByDeckIdIncludesMatchedCards(string userId, int deckId, DateTime[] dates);
    }
}