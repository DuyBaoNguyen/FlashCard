using FlashCard.Models;
using FlashCard.Services;

namespace FlashCard.ApiModels
{
    public class ProposedBackApiModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Meaning { get; set; }
        public string Example { get; set; }
        public string Image { get; set; }
        public bool FromAdmin { get; set; }
        public bool Approved { get; set; }
        public object Author { get; set; }

        public ProposedBackApiModel()
        {

        }

        public ProposedBackApiModel(Back back)
        {
            Id = back.Id;
            Type = back.Type;
            Meaning = back.Meaning;
            Example = back.Example;
            Image = ImageService.GetBase64(back.Image, back.ImageType);
            FromAdmin = back.FromAdmin;
            Approved = back.Approved;
            Author = back.Author == null ? null : new { Id = back.AuthorId, DisplayName = back.Author.Name };
        }
    }
}