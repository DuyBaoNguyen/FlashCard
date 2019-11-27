namespace FlashCard.Models
{
    public class TestedCard
    {
        public int TestId { get; set; }
        public int CardId { get; set; }
        public bool Failed { get; set; }
        public Test Test { get; set; }
        public Card Card { get; set; }
    }
}