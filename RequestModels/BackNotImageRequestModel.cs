using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
	public class BackNotImageRequestModel
	{
		[StringLength(20)]
		public string Type { get; set; }

		[StringLength(200)]
		public string Meaning { get; set; }

		[StringLength(400)]
		public string Example { get; set; }
	}
}