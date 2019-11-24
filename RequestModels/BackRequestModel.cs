using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
    public class BackRequestModel
    {
        [StringLength(20)]
        public string Type { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Meaning { get; set; }

        [StringLength(400)]
        public string Example { get; set; }

        public string Image { get; set; }
    }
}
