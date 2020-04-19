using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
	public class Card
	{
		public int Id { get; set; }

		[Required]
		[StringLength(100)]
		public string Front { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime CreatedDate { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime LastModifiedDate { get; set; }

		public int? SourceId { get; set; }

		[Required]
		public string OwnerId { get; set; }

		public string AuthorId { get; set; }

		public Card Source { get; set; }
		public ApplicationUser Owner { get; set; }
		public ApplicationUser Author { get; set; }
		public ICollection<CardAssignment> CardAssignments { get; set; }
		public ICollection<Back> Backs { get; set; }
		public ICollection<TestedCard> TestedCards { get; set; }
		public ICollection<MatchedCard> MatchedCards { get; set; }
	}
}