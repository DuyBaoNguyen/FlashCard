using System.ComponentModel.DataAnnotations;

namespace FlashCard.RequestModels
{
    public class PasswordRequestModel
    {
        [Required]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }
        
        [Required]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.")]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [Required]
        [Display(Name = "Comfirm password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}