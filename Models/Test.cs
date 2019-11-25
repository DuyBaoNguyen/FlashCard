using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
    public class Test
    {
        public int Id { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateTime { get; set; }

        public float Score { get; set; }
        
        public int TotalCards { get; set; }

        public int DeckId { get; set; }

        public Deck Deck { get; set; }
        public ICollection<FailedCard> FailedCards { get; set; }
    }
}