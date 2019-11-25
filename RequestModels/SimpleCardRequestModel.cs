using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
    public class SimpleCardRequestModel
    {
        [Required]
        [StringLength(100)]
        public string Front { get; set; }
    }
}