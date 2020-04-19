using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Data;

namespace FlashCard.Repositories
{
	public class RepositoryWrapper : IRepositoryWrapper
	{
		private readonly ApplicationDbContext dbContext;
		private readonly IDeckRepository deck = null;
		private readonly ICardRepository card = null;
		private readonly IBackRepository back = null;

		public IDeckRepository Deck
		{
			get
			{
				if (deck == null)
				{
					return new DeckRepository(dbContext);
				}
				return deck;
			}
		}

		public ICardRepository Card
		{
			get
			{
				if (card == null)
				{
					return new CardRepository(dbContext);
				}
				return card;
			}
		}

		public IBackRepository Back
		{
			get
			{
				if (back == null)
				{
					return new BackRepository(dbContext);
				}
				return back;
			}
		}

		public RepositoryWrapper(ApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		public Task<int> SaveChangesAsync()
		{
			return dbContext.SaveChangesAsync();
		}
	}
}