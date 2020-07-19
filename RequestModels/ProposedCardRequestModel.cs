using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FlashCard.RequestModels
{
    public class ProposedCardRequestModel
    {
        [Required]
        [StringLength(100)]
        [RegularExpression(@"[\w -?!]+", ErrorMessage = "This field only contains alphanumeric characters, underscores or spaces.")]
        public string Front { get; set; }

        [StringLength(20)]
        public string Type { get; set; }

        [Required]
        [StringLength(200)]
        public string Meaning { get; set; }

        [StringLength(400)]
        public string Example { get; set; }

        public IFormFile Image { get; set; }
    }
}
