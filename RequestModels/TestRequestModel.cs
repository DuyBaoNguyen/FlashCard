using System;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class TestRequestModel
	{
		[Required(ErrorMessage = "The end time is required")]
		public DateTime DateTime { get; set; }

		[Required]
		public int[] SucceededCardIds { get; set; }

		[Required]
		public int[] FailedCardIds { get; set; }
	}
}