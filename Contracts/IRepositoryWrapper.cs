using System.Threading.Tasks;

namespace FlashCard.Contracts
{
	public interface IRepositoryWrapper
	{
		IDeckRepository Deck { get; }
		ICardRepository Card { get; }
		IBackRepository Back { get; }
		Task<int> SaveChangesAsync();
	}
}