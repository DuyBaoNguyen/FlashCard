namespace FlashCard.Models
{
    public class CardOwner
    {
        public int CardId { get; set; }
        public string UserId { get; set; }
        public Card Card { get; set; }
        public ApplicationUser User { get; set; }
    }
}