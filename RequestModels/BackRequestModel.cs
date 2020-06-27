using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FlashCard.RequestModels
{
	public class BackRequestModel
	{
		[StringLength(20)]
		public string Type { get; set; }

		[Required]
		[StringLength(200)]
		public string Meaning { get; set; }

		[StringLength(400)]
		public string Example { get; set; }

		public IFormFile Image { get; set; }
	}
}
