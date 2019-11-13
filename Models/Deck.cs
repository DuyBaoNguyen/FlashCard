using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
    public class Deck
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(400)]
        public string Description { get; set; }

        public bool Public { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime LastModified { get; set; }

        public bool Approved { get; set; }

        public int Version { get; set; }

        public int CategoryId { get; set; }

        public int? SourceId { get; set; }

        [Required]
        public string OwnerId { get; set; }

        public string AuthorId { get; set; }

        public Category Category { get; set; }
        public Deck Source { get; set; }
        public ApplicationUser Owner { get; set; }
        public ApplicationUser Author { get; set; }
        public ICollection<Test> Tests { get; set; }
        public ICollection<CardAssignment> CardAssignments { get; set; }
        public ICollection<Proposal> Proposals { get; set; }
        // public ICollection<Contributor> Contributors { get; set; }
    }
}