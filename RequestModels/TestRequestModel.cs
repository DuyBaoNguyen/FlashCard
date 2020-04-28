using System;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class TestRequestModel
	{
		[Required(ErrorMessage = "The start time is required")]
		public DateTime? DateTime { get; set; }

		[Required]
		public int[] SucceededCardIds { get; set; }

		[Required]
		public int[] FailedCardIds { get; set; }
	}
}