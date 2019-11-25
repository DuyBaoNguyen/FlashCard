namespace FlashCard.Models
{
    public class FailedCard
    {
        public int TestId { get; set; }
        public int CardId { get; set; }
        public Test Test { get; set; }
        public Card Card { get; set; }
    }
}