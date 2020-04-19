using System.Collections.Generic;

namespace FlashCard.Dto
{
	public class CardDto
	{
		public int Id { get; set; }
		public string Front { get; set; }
		public IEnumerable<BackDto> Backs { get; set; }
	}
}