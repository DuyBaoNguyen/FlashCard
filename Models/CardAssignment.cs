namespace FlashCard.Models
{
    public class CardAssignment
    {
        public int DeckId { get; set; }
        public int CardId { get; set; }
        public Deck Deck { get; set; }
        public Card Card { get; set; }
    }
}