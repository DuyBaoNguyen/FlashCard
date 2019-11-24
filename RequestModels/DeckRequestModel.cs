using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
    public class DeckRequestModel
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(400)]
        public string Description { get; set; }

        public bool? Public { get; set; }

        public CategoryRequestModel Category { get; set; }

        public DeckRequestModel()
        {
            Category = new CategoryRequestModel();
        }
    }
}