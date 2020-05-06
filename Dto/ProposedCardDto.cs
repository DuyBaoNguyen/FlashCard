using System.Collections.Generic;

namespace FlashCard.Dto
{
	public class ProposedCardDto
	{
		public int Id { get; set; }
		public string Front { get; set; }
		public IEnumerable<ProposedBackDto> Backs { get; set; }
	}
}