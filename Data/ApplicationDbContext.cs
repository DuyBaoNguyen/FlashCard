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
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>, IPersistedGrantDbContext
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
        public DbSet<Category> Categories { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Back> Backs { get; set; }
        public DbSet<CardAssignment> CardAssignments { get; set; }
        public DbSet<Proposal> Proposals { get; set; }
        public DbSet<CardOwner> CardOwners { get; set; }
        public DbSet<TestedCard> TestedCards { get; set; }

        Task<int> IPersistedGrantDbContext.SaveChangesAsync() => base.SaveChangesAsync();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);

            builder.Entity<ApplicationUser>().ToTable("User");
            builder.Entity<IdentityRole>().ToTable("Role");
            builder.Entity<PersistedGrant>().ToTable("PersistedGrant");
            builder.Entity<DeviceFlowCodes>().ToTable("DeviceFlowCodes");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaim");
            builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaim");
            builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogin");
            builder.Entity<IdentityUserRole<string>>().ToTable("UserRole");
            builder.Entity<IdentityUserToken<string>>().ToTable("UserToken");
            builder.Entity<Deck>().ToTable("Deck");
            builder.Entity<Category>().ToTable("Category");
            builder.Entity<Test>().ToTable("Test");
            builder.Entity<Card>().ToTable("Card");
            builder.Entity<Back>().ToTable("Back");
            builder.Entity<CardAssignment>().ToTable("CardAssignment");
            builder.Entity<Proposal>().ToTable("Proposal");
            builder.Entity<CardOwner>().ToTable("CardOwner");
            builder.Entity<TestedCard>().ToTable("TestedCard");

            builder.Entity<CardAssignment>().HasKey(c => new { c.CardId, c.DeckId });
            builder.Entity<CardOwner>().HasKey(c => new { c.CardId, c.UserId });
            builder.Entity<TestedCard>().HasKey(f => new { f.CardId, f.TestId });

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
                .WithOne()
                .HasForeignKey<Deck>(d => d.SourceId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Deck>()
                .HasOne(d => d.Category)
                .WithMany(c => c.Decks)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Deck>()
                .Property(d => d.Version)
                .HasDefaultValue(1);

            builder.Entity<CardOwner>()
                .HasOne(c => c.User)
                .WithMany(u => u.CardOwners)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Back>()
                .HasOne(b => b.Owner)
                .WithMany(u => u.OwnedBacks)
                .HasForeignKey(b => b.OwnerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Back>()
                .HasOne(b => b.Author)
                .WithMany(u => u.AuthorizedBacks)
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Back>()
                .HasOne(b => b.Card)
                .WithMany(c => c.Backs)
                .HasForeignKey(b => b.CardId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Back>()
                .HasOne(b => b.Source)
                .WithOne()
                .HasForeignKey<Back>(b => b.SourceId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Back>()
                .Property(b => b.Version)
                .HasDefaultValue(1);

            builder.Entity<Proposal>()
                .HasOne(p => p.User)
                .WithMany(u => u.Proposals)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
