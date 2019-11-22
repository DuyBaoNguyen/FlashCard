using FlashCard.Models;

namespace FlashCard.ApiModels
{
    public class CategoryApiModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public CategoryApiModel()
        {

        }

        public CategoryApiModel(Category category)
        {
            Id = category.Id;
            Name = category.Name;
        }
    }
}