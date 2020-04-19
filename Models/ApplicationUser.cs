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
		[StringLength(100)]
		public string Avatar { get; set; }

		public ICollection<Deck> OwnedDecks { get; set; }
		public ICollection<Deck> AuthorizedDecks { get; set; }
		public ICollection<Card> OwnedCards { get; set; }
		public ICollection<Card> AuthorizedCards { get; set; }
		public ICollection<Back> AuthorizedBacks { get; set; }
		public ICollection<SharedDeck> SharedDecks { get; set; }
	}
}