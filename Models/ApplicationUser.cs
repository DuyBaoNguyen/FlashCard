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
		[StringLength(40)]
		public string Picture { get; set; }

		public ICollection<Deck> OwnedDecks { get; set; }
		public ICollection<Deck> AuthorizedDecks { get; set; }
		public ICollection<Card> OwnedCards { get; set; }
		public ICollection<Card> AuthorizedCards { get; set; }
		public ICollection<Back> AuthorizedBacks { get; set; }
		public ICollection<SharedDeck> SharedDecks { get; set; }
		public ICollection<Test> Tests { get; set; }
		public ICollection<Match> Matches { get; set; }
		public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
	}
}