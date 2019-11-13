using System;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
    public class Test
    {
        [DataType(DataType.DateTime)]
        public DateTime DateTime { get; set; }
        
        public int TotalCards { get; set; }

        public int FailedCards { get; set; }

        public int DeckId { get; set; }

        public Deck Deck { get; set; }
    }
}