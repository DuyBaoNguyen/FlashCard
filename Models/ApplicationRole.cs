using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace FlashCard.Models
{
	public class ApplicationRole : IdentityRole
	{
		public ApplicationRole() : base()
		{
			
		}

		public ApplicationRole(string roleName) : base(roleName)
		{

		}

		public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
	}
}