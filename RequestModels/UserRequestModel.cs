using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
    public class UserRequestModel
    {
        [Required]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "Display name must be at least 4 characters.")]
        [RegularExpression(@"[\w ]+", ErrorMessage = "Display name just contains letter, digit and space.")]
        public string DisplayName { get; set; }
    }
}