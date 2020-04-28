using System.Linq;
using FlashCard.Models;

namespace FlashCard.Contracts
{
    public interface IMatchRepository : IRepositoryBase<Match>
    {
        IQueryable<Match> QueryIncludesMatchedCards(string userId);
        IQueryable<Match> QueryByDeckIdIncludesMatchedCards(string userId, int deckId);
    }
}