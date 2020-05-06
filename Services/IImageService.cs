using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace FlashCard.Services
{
	public interface IImageService
	{
		Task<string> UploadImage(IFormFile image);
		string DuplicateImage(string imageNname);
		bool TryDeleteImage(string imageName);
		string GetBackImageBaseUrl();
	}
}