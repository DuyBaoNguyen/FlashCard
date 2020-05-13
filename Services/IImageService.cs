using System.Threading.Tasks;
using FlashCard.Util;
using Microsoft.AspNetCore.Http;

namespace FlashCard.Services
{
	public interface IImageService
	{
		string BackImageBaseUrl { get; }
		string UserPictureBaseUrl { get; }
		Task<string> UploadImage(IFormFile image, ImageType imageType);
		string DuplicateImage(string imageNname);
		bool TryDeleteImage(string imageName, ImageType imageType);
	}
}