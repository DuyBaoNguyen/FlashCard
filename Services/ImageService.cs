using System;
using System.Text.RegularExpressions;

namespace FlashCard.Services
{
    public class ImageService
    {
        public class Image
        {
            public byte[] Data { get; set; }
            public string Type { get; set; }
        }

        public static Image GetImage(string base64)
        {
            if (base64 == null)
            {
                return null;
            }

            string pattern = @"data:image/([a-z]+);base64,";
            string prefix = Regex.Match(base64, pattern).Value;
            string stringData = Regex.Replace(base64, pattern, "");

            return new Image
            {
                Data = Convert.FromBase64String(stringData),
                Type = Regex.Replace(prefix, pattern, "$1")
            };
        }

        public static string GetBase64(byte[] image, string type)
        {
            return image == null ? null : $"data:image/{type};base64,{Convert.ToBase64String(image)}";
        }
    }
}