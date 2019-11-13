using System;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
    public class Proposal
    {
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string Action { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateTime { get; set; }

        public bool Approved { get; set; }

        public int CardId { get; set; }

        public int DeckId { get; set; }

        public string UserId { get; set; }

        public Card Card { get; set; }
        public Deck Deck { get; set; }
        public ApplicationUser User { get; set; }
    }
}