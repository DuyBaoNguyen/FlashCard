using FlashCard.Models;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Extensions;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace FlashCard.Data
{
	public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string,
		IdentityUserClaim<string>, ApplicationUserRole, IdentityUserLogin<string>,
		IdentityRoleClaim<string>, IdentityUserToken<string>>, IPersistedGrantDbContext
	{
		private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;

		public ApplicationDbContext(
			DbContextOptions options,
			IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options)
		{
			_operationalStoreOptions = operationalStoreOptions;
		}

		public DbSet<PersistedGrant> PersistedGrants { get; set; }
		public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }
		public DbSet<Deck> Decks { get; set; }
		public DbSet<Card> Cards { get; set; }
		public DbSet<Back> Backs { get; set; }
		public DbSet<SharedDeck> SharedDecks { get; set; }
		public DbSet<CardAssignment> CardAssignments { get; set; }
		public DbSet<Test> Tests { get; set; }
		public DbSet<TestedCard> TestedCards { get; set; }
		public DbSet<Match> Matches { get; set; }
		public DbSet<MatchedCard> MatchedCards { get; set; }

		Task<int> IPersistedGrantDbContext.SaveChangesAsync() => base.SaveChangesAsync();

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);

			builder.Entity<ApplicationUser>().ToTable("User");
			builder.Entity<ApplicationRole>().ToTable("Role");
			builder.Entity<PersistedGrant>().ToTable("PersistedGrant");
			builder.Entity<DeviceFlowCodes>().ToTable("DeviceFlowCodes");
			builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaim");
			builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaim");
			builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogin");
			builder.Entity<ApplicationUserRole>().ToTable("UserRole");
			builder.Entity<IdentityUserToken<string>>().ToTable("UserToken");
			builder.Entity<Deck>().ToTable("Deck");
			builder.Entity<Card>().ToTable("Card");
			builder.Entity<Back>().ToTable("Back");
			builder.Entity<CardAssignment>().ToTable("CardAssignment");
			builder.Entity<SharedDeck>().ToTable("SharedDeck");
			builder.Entity<Test>().ToTable("Test");
			builder.Entity<TestedCard>().ToTable("TestedCard");
			builder.Entity<Match>().ToTable("Match");
			builder.Entity<MatchedCard>().ToTable("MatchedCard");

			builder.Entity<ApplicationUser>(u => u.Property(t => t.PasswordHash).HasColumnName("Password"));

			builder.Entity<CardAssignment>().HasKey(c => new { c.CardId, c.DeckId });
			builder.Entity<SharedDeck>().HasKey(s => new { s.DeckId, s.UserId });
			builder.Entity<TestedCard>().HasKey(f => new { f.CardId, f.TestId });
			builder.Entity<MatchedCard>().HasKey(m => new { m.CardId, m.MatchId });

			builder.Entity<ApplicationUser>()
				.HasMany(u => u.UserRoles)
				.WithOne(ur => ur.User)
				.HasForeignKey(ur => ur.UserId)
				.IsRequired();

			builder.Entity<ApplicationRole>()
				.HasMany(r => r.UserRoles)
				.WithOne(ur => ur.Role)
				.HasForeignKey(ur => ur.RoleId)
				.IsRequired();

			builder.Entity<Deck>()
				.HasOne(d => d.Owner)
				.WithMany(u => u.OwnedDecks)
				.HasForeignKey(d => d.OwnerId)
				.OnDelete(DeleteBehavior.NoAction);

			builder.Entity<Deck>()
				.HasOne(d => d.Author)
				.WithMany(u => u.AuthorizedDecks)
				.HasForeignKey(d => d.AuthorId)
				.OnDelete(DeleteBehavior.SetNull);

			builder.Entity<Deck>()
				.HasOne(d => d.Source)
				.WithMany()
				.HasForeignKey(d => d.SourceId);

			builder.Entity<Card>()
				.HasOne(c => c.Owner)
				.WithMany(u => u.OwnedCards)
				.HasForeignKey(c => c.OwnerId)
				.OnDelete(DeleteBehavior.NoAction);

			builder.Entity<Card>()
				.HasOne(c => c.Author)
				.WithMany(u => u.AuthorizedCards)
				.HasForeignKey(c => c.AuthorId)
				.OnDelete(DeleteBehavior.SetNull);

			builder.Entity<Card>()
				.HasOne(c => c.Source)
				.WithMany()
				.HasForeignKey(c => c.SourceId);

			builder.Entity<Back>()
				.HasOne(b => b.Author)
				.WithMany(u => u.AuthorizedBacks)
				.HasForeignKey(b => b.AuthorId)
				.OnDelete(DeleteBehavior.SetNull);

			builder.Entity<Back>()
				.HasOne(b => b.Card)
				.WithMany(c => c.Backs)
				.HasForeignKey(b => b.CardId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Back>()
				.HasOne(b => b.Source)
				.WithMany()
				.HasForeignKey(b => b.SourceId);
		}
	}
}
