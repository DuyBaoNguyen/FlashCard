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

		public int DeckId { get; set; }

		[Required]
		public string TakerId { get; set; }

		public Deck Deck { get; set; }
		public ApplicationUser Taker { get; set; }
		public ICollection<TestedCard> TestedCards { get; set; }
	}
}