namespace FlashCard.RequestModels
{
    public class ProposedBacksRequestModel
    {
        public int[] ProposedBacks { get; set; } = new int[0];
        public bool Approved { get; set; }
    }
}