using System;
using System.Collections.Generic;

namespace FlashCard.Dto
{
	public class TestDto
	{
		public float Score { get; set; }
		public DateTime DateTime { get; set; }
		public DeckWithNameDto Deck { get; set; }
		public IEnumerable<string> SucceededCards { get; set; }
		public IEnumerable<string> FailedCards { get; set; }
		// public IEnumerable<CardDto> FirstRememberedCards { get; set; }
	}
}