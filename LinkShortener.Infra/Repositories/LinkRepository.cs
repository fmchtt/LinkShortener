using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LinkShortner.Infra.Repositories;

public class LinkRepository(LinkShortnerDbContext dbContext) : ILinkRepository
{
    public async Task<Link?> GetByHash(string hash)
    {
        return await dbContext.Links.FirstOrDefaultAsync(l => l.Hash == hash);
    }

    public async Task<Link?> GetById(Guid linkId)
    {
        return await dbContext.Links.FirstOrDefaultAsync(l => l.Id == linkId);
    }

    public async Task<List<Link>> GetByOwner(Guid ownerId)
    {
        return await dbContext.Links.Where(l => l.OwnerId == ownerId).ToListAsync();
    }

    public async Task<bool> VerifyHash(string hash)
    {
        return await dbContext.Links.AnyAsync(l => l.Hash == hash);
    }

    public async Task Create(Link link)
    {
        await dbContext.Links.AddAsync(link);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Link link)
    {
        dbContext.Links.Remove(link);
        await dbContext.SaveChangesAsync();
    }
}