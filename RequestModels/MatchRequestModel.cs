using System;
using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class MatchRequestModel
	{
		public int TotalTime { get; set; }

		[Required(ErrorMessage = "The start time is required")]
		public DateTime? StartTime { get; set; }

		[Required(ErrorMessage = "The end time is required")]
		public DateTime? EndTime { get; set; }

		[Required(ErrorMessage = "The succeeded card ids are required")]
		public int[] SucceededCardIds { get; set; }

		[Required(ErrorMessage = "The failed card ids are required")]
		public int[] FailedCardIds { get; set; }
	}
}