using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class CardRequestModel
	{
		[Required]
		[StringLength(100)]
		[RegularExpression(@"[\w -?!]+", ErrorMessage = "This field only contains alphanumeric characters, underscores or spaces.")]
		public string Front { get; set; }
	}
}