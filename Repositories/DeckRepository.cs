using System.Linq;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Data;
using FlashCard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashCard.Repositories
{
	public class DeckRepository : RepositoryBase<Deck>, IDeckRepository
	{
		public DeckRepository(ApplicationDbContext dbContext) : base(dbContext)
		{

		}

		public IQueryable<Deck> Query(string userId, string deckName)
		{
			if (deckName == null || deckName.Length == 0)
			{
				return dbContext.Decks
					.Where(d => d.OwnerId == userId)
					.OrderBy(d => d.Name);
			}
			return dbContext.Decks
				.Where(d => d.OwnerId == userId && d.Name.ToLower().Contains(deckName.ToLower()))
				.OrderBy(d => d.Name);
		}

		public IQueryable<Deck> QueryById(string userId, int deckId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.Id == deckId);
		}

		public IQueryable<Deck> QueryByIdCheckingSharedDeck(string userId, int deckId)
		{
			return dbContext.Decks
				.Where(d => d.Id == deckId && (d.OwnerId == userId || d.Approved));
		}

		public IQueryable<Deck> QueryByIdIncludesCardAssignments(string userId, int deckId)
		{
			return dbContext.Decks
				.Include(d => d.CardAssignments)
				.Where(d => d.OwnerId == userId && d.Id == deckId);
		}

		public IQueryable<Deck> QueryByName(string userId, string deckName)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.Name == deckName.Trim());
		}

		public IQueryable<Deck> QueryByBeingNotApproved()
		{
			return dbContext.Decks.Where(d => d.Public && !d.Approved);
		}

		public IQueryable<Deck> QueryByIdAndBeingNotApproved(int deckId)
		{
			return dbContext.Decks.Where(d => d.Id == deckId && d.Public && !d.Approved);
		}

		public IQueryable<Deck> QueryByBeingApproved(string adminId, string deckName)
		{
			if (deckName == null || deckName.Length == 0)
			{
				return dbContext.Decks
					.Where(d => d.OwnerId == adminId && d.Approved)
					.OrderBy(d => d.Name);
			}
			return dbContext.Decks
				.Where(d => d.OwnerId == adminId && d.Approved && d.Name.ToLower().Contains(deckName.ToLower()))
				.OrderBy(d => d.Name);
		}

		public IQueryable<Deck> QueryByIdAndBeingApproved(string adminId, int deckId)
		{
			return dbContext.Decks.Where(d => d.Id == deckId && d.OwnerId == adminId && d.Approved);
		}

		public IQueryable<Deck> QueryByHavingSource(string userId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.SourceId != null);
		}

		public IQueryable<Deck> QueryBySourceId(string userId, int sourceId)
		{
			return dbContext.Decks.Where(d => d.OwnerId == userId && d.SourceId == sourceId);
		}

		public IQueryable<Deck> QueryByBeingApprovedAndNotAdmin(string adminId, string deckName)
		{
			var queryDecks = dbContext.Decks.Where(d => d.OwnerId != adminId && d.Approved);

			if (deckName != null && deckName.Trim().Length > 0)
			{
				queryDecks = queryDecks.Where(d => d.Name.ToLower().Contains(deckName.Trim().ToLower()));
			}

			return queryDecks.OrderBy(d => d.Name);
		}

		public IQueryable<Deck> QueryByIdAndBeingApprovedAndNotAdmin(string adminId, int deckId)
		{
			return dbContext.Decks.Where(d => d.Id == deckId && d.OwnerId != adminId && d.Approved);
		}

		public IQueryable<Deck> QueryByIdIncludesSharedDeck(int deckId)
		{
			return dbContext.Decks
				.Include(d => d.SharedDecks)
				.Where(d => d.Id == deckId && d.Approved);
		}

		public IQueryable<Deck> QueryByBeingShared(string userId)
		{
			var querySharedDeckIds = dbContext.SharedDecks
				.Where(sd => sd.UserId == userId && sd.Pinned)
				.Select(sd => sd.DeckId);
			return dbContext.Decks.Where(d => d.Approved && querySharedDeckIds.Contains(d.Id));
		}

		public IQueryable<Deck> QueryByCardIdsIncludesCardAssignmentsAndCard(int[] cardIds)
		{
			var queryDeckIds = dbContext.CardAssignments
				.Where(ca => cardIds.Contains(ca.CardId))
				.Select(ca => ca.DeckId)
				.Distinct();
			return dbContext.Decks
				.Include(d => d.CardAssignments)
					.ThenInclude(ca => ca.Card)
				.Where(d => queryDeckIds.Contains(d.Id));
		}

		public async Task LoadCards(Deck deck)
		{
			foreach (var cardAssignment in deck.CardAssignments)
			{
				await dbContext.Entry(cardAssignment).Reference(ca => ca.Card).LoadAsync();
			}
		}
	}
}