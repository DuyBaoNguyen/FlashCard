using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace FlashCard.Util
{
	public class ImageUtil
	{
		public static bool CheckExtensions(IFormFile file)
		{
			var regex = new Regex(@"(.png|.jpg|.jpeg|.bmp)$");
			return regex.IsMatch(file.FileName);
		}
	}
}