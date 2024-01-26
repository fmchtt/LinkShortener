using LinkShortner.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LinkShortner.Infra;

public class LinkShortnerDbContext(DbContextOptions<LinkShortnerDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Link> Links { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasMany(u => u.Links).WithOne(l => l.Owner);
    }
}