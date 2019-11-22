using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace FlashCard.Models
{
    public class ApplicationUser : IdentityUser
    {
        [PersonalData]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [PersonalData]
        public byte[] Avatar { get; set; }

        [PersonalData]
        [StringLength(4)]
        public string ImageType { get; set; }

        public ICollection<Deck> OwnedDecks { get; set; }
        public ICollection<Deck> AuthorizedDecks { get; set; }
        public ICollection<Back> OwnedBacks { get; set; }
        public ICollection<Back> AuthorizedBacks { get; set; }
        public ICollection<Proposal> Proposals { get; set; }
        public ICollection<CardOwner> CardOwners { get; set; }
    }
}
