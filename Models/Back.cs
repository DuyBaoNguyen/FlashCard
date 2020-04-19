using System;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
	public class Back
	{
		public int Id { get; set; }

		[StringLength(20)]
		public string Type { get; set; }

		[StringLength(200)]
		public string Meaning { get; set; }

		[StringLength(400)]
		public string Example { get; set; }

		[StringLength(100)]
		public string Image { get; set; }

		public bool Public { get; set; }

		public bool Approved { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime CreatedDate { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime LastModifiedDate { get; set; }

		public int CardId { get; set; }

		public int? SourceId { get; set; }

		public string AuthorId { get; set; }

		public Card Card { get; set; }
		public Back Source { get; set; }
		public ApplicationUser Author { get; set; }
	}
}