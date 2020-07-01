namespace FlashCard.Models
{
	public class SharedDeck
	{
		public int DeckId { get; set; }
		public string UserId { get; set; }
		public bool Completed { get; set; }
		public bool Pinned { get; set; }
		public Deck Deck { get; set; }
		public ApplicationUser User { get; set; }
	}
}