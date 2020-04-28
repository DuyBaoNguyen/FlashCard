using System;
using System.Collections.Generic;

namespace FlashCard.Dto
{
	public class MatchDto
	{
		public float Score { get; set; }
		public int TotalTime { get; set; }
		public DateTime StartTime { get; set; }
		public DateTime EndTime { get; set; }
		public DeckWithNameDto Deck { get; set; }
		public IEnumerable<string> SucceededCards { get; set; }
		public IEnumerable<string> FailedCards { get; set; }
	}
}