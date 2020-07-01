namespace FlashCard.Models
{
    public class SharedCard
    {
        public int CardId { get; set; }
        public string UserId { get; set; }
        public bool Remembered { get; set; }
        public Card Card { get; set; }
        public ApplicationUser User { get; set; }
    }
}