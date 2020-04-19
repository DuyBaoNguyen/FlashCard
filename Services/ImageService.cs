using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace FlashCard.Services
{
	public class ImageService : IImageService
	{
		private readonly IWebHostEnvironment env;
		private readonly IHttpContextAccessor httpContextAccessor;

		public ImageService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
		{
			this.env = env;
			this.httpContextAccessor = httpContextAccessor;
		}

		public async Task<string> UploadImage(IFormFile image)
		{
			if (image == null || image.Length == 0)
			{
				return null;
			}

			var imageName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(image.FileName);
			var filePath = Path.Combine(env.ContentRootPath, "assets/images", imageName);

			using (var stream = File.Create(filePath))
			{
				await image.CopyToAsync(stream);
			}
			return imageName;
		}

		public bool TryDeleteImage(string imageName)
		{
			if (imageName == null)
			{
				return true;
			}

			var filePath = Path.Combine(env.ContentRootPath, "assets/images", imageName);
			try
			{
				File.Delete(filePath);
				return true;
			}
			catch
			{
				return false;
			}
		}

		public string GetBackImageBaseUrl()
		{
			var req = httpContextAccessor.HttpContext.Request;
			return $"{req.Scheme}://{req.Host}/storage/images";
		}
	}
}