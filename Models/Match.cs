using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
	public class Match
	{
		public int Id { get; set; }

		public float Score { get; set; }

		public int TotalTime { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime StartTime { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime EndTime { get; set; }

		public int DeckId { get; set; }

		[Required]
		public string TakerId { get; set; }

		public Deck Deck { get; set; }
		public ApplicationUser Taker { get; set; }
		public ICollection<MatchedCard> MatchedCards { get; set; }
	}
}