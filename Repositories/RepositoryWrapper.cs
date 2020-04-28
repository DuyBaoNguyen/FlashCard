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
		private readonly ITestRepository test = null;
		private readonly IMatchRepository match = null;

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

		public ITestRepository Test
		{
			get
			{
				if (test == null)
				{
					return new TestRepository(dbContext);
				}
				return test;
			}
		}

		public IMatchRepository Match
		{
			get
			{
				if (match == null)
				{
					return new MatchRepository(dbContext);
				}
				return match;
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