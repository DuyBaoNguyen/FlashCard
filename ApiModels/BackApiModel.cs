using System;
using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class BackApiModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Meaning { get; set; }
        public string Example { get; set; }
        public string Image { get; set; }
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
            Image = back.Image == null ? null : $"data:image/{back.ImageType};base64,{Convert.ToBase64String(back.Image)}";
            Author = back.Author == null ? null : new { Id = back.AuthorId, DisplayName = back.Author.Name };
        }
    }
}