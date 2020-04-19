using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace FlashCard.Services
{
	public interface IImageService
	{
		Task<string> UploadImage(IFormFile image);
		bool TryDeleteImage(string name);
		string GetBackImageBaseUrl();
	}
}