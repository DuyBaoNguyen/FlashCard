using System;
using System.IO;
using System.Threading.Tasks;
using FlashCard.Util;
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

		public string BackImageBaseUrl
		{
			get
			{
				var req = httpContextAccessor.HttpContext.Request;
				return $"{req.Scheme}://{req.Host}/storage/images";
			}
		}

		public string UserPictureBaseUrl
		{
			get
			{
				var req = httpContextAccessor.HttpContext.Request;
				return $"{req.Scheme}://{req.Host}/storage/pictures";
			}
		}

		public async Task<string> UploadImage(IFormFile image, ImageType imageType)
		{
			if (image == null || image.Length == 0)
			{
				return null;
			}

			var imageName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(image.FileName);
			var imageDirName = imageType == ImageType.Image ? "images" : "pictures";
			var filePath = Path.Combine(env.ContentRootPath, "assets", imageDirName, imageName);

			try
			{
				using (var stream = File.Create(filePath))
				{
					await image.CopyToAsync(stream);
				}
			}
			catch
			{
				return null;
			}
			return imageName;
		}

		public string DuplicateImage(string imageName)
		{
			if (imageName == null)
			{
				return null;
			}

			var filePath = Path.Combine(env.ContentRootPath, "assets/images", imageName);
			var newImageName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(imageName);
			var newFilePath = Path.Combine(env.ContentRootPath, "assets/images", newImageName);

			if (File.Exists(filePath))
			{
				File.Copy(filePath, newFilePath);
				return newImageName;
			}
			return null;
		}

		public bool TryDeleteImage(string imageName, ImageType imageType)
		{
			if (imageName == null)
			{
				return true;
			}

			var imageDirName = imageType == ImageType.Image ? "images" : "pictures";
			var filePath = Path.Combine(env.ContentRootPath, "assets", imageDirName, imageName);
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
	}
}