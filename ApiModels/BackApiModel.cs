using System;
using FlashCard.Models;
using FlashCard.Services;

namespace FlashCard.ApiModels
{
    public class BackApiModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Meaning { get; set; }
        public string Example { get; set; }
        public string Image { get; set; }
        public bool FromAdmin { get; set; }
        public object Author { get; set; }

        public BackApiModel()
        {

        }

        public BackApiModel(Back back)
        {
            Id = back.Id;
            Type = back.Type;
            Meaning = back.Meaning;
            Example = back.Example;
            Image = ImageService.GetBase64(back.Image, back.ImageType);
            FromAdmin = back.FromAdmin;
            Author = back.Author == null ? null : new { Id = back.AuthorId, DisplayName = back.Author.Name };
        }
    }
}