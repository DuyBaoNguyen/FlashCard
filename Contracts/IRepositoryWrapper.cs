using System.Threading.Tasks;

namespace FlashCard.Contracts
{
	public interface IRepositoryWrapper
	{
		IDeckRepository Deck { get; }
		ICardRepository Card { get; }
		IBackRepository Back { get; }
		ITestRepository Test { get; }
		IMatchRepository Match { get; }
		IUserRepository User { get; }
		ISharedDeckRepository SharedDeck { get; }
		ISharedCardRepository SharedCard { get; }
		Task<int> SaveChangesAsync();
	}
}