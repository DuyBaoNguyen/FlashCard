using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class DeckRequestModel
	{
		[Required]
		[StringLength(100)]
		[RegularExpression("[a-zA-Z0-9 ]+")]
		public string Name { get; set; }

		[StringLength(500)]
		public string Description { get; set; }

		[Required]
		[StringLength(7)]
		[RegularExpression(@"^#[a-f0-9]{6}$")]
		public string Theme { get; set; }
	}
}