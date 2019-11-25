using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
    public class CardRequestModel
    {
        [Required]
        [StringLength(100)]
        public string Front { get; set; }

        public BackRequestModel Back { get; set; }

        public CardRequestModel()
        {
            Back = new BackRequestModel();
        }
    }
}