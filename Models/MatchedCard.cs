namespace FlashCard.Models
{
	public class MatchedCard
	{
		public int MatchId { get; set; }
		public int CardId { get; set; }
		public bool Failed { get; set; }
		public Match Match { get; set; }
		public Card Card { get; set; }
	}
}