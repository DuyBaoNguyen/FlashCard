using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
    public class Card
    {
        public int Id { get; set; }

        [Required]
        [StringLength(30)]
        public string Front { get; set; }

        public ICollection<CardAssignment> CardAssignments { get; set; }
        public ICollection<Proposal> Proposals { get; set; }
        public ICollection<CardOwner> CardOwners { get; set; }
        public ICollection<Back> Backs { get; set ;}
    }
}