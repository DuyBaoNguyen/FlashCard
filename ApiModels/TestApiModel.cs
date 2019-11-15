using System;

namespace FlashCard.ApiModels
{
    public class TestApiModel
    {
        public DateTime DateTime { get; set; }
        public int TotalCards { get; set; }
        public int FailedCards { get; set; }
    }
}