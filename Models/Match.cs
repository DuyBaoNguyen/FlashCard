using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.Models
{
	public class Match
	{
		public int Id { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime DateTime { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime TotalTime { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime CompletionTime { get; set; }

		public float Score { get; set; }

		public int DeckId { get; set; }

		public Deck Deck { get; set; }
		public ICollection<MatchedCard> MatchedCards { get; set; }
	}
}