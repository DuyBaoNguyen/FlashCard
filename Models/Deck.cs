using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
	public class Deck
	{
		public int Id { get; set; }

		[Required]
		[StringLength(100)]
		public string Name { get; set; }

		[StringLength(500)]
		public string Description { get; set; }

		[Required]
		[StringLength(7)]
		[RegularExpression(@"^#[a-f0-9]{6}$")]
		public string Theme { get; set; }

		public bool Public { get; set; }

		public bool Approved { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime CreatedDate { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime LastModifiedDate { get; set; }

		public int? SourceId { get; set; }

		[Required]
		public string OwnerId { get; set; }

		public string AuthorId { get; set; }

		public Deck Source { get; set; }
		public ApplicationUser Owner { get; set; }
		public ApplicationUser Author { get; set; }
		public ICollection<Test> Tests { get; set; }
		public ICollection<Match> Matches { get; set; }
		public ICollection<CardAssignment> CardAssignments { get; set; }
		public ICollection<SharedDeck> SharedDecks { get; set; }
	}
}