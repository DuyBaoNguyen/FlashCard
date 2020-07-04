using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class DeckRequestModel
	{
		[Required]
		[StringLength(100)]
		[RegularExpression(@"[\w ]+", ErrorMessage = "This field only contains alphanumeric characters, underscores or spaces.")]
		public string Name { get; set; }

		[StringLength(500)]
		public string Description { get; set; }

		[Required]
		[StringLength(7)]
		[RegularExpression(@"^#[a-f0-9]{6}$")]
		public string Theme { get; set; }
	}
}