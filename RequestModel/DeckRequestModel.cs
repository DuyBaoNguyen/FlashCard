using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModel
{
    public class DeckRequestModel
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(400)]
        public string Description { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}