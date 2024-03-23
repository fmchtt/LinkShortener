using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace LinkShortner.Infra.Repositories;

public class LinkRepository(LinkShortnerDbContext dbContext) : ILinkRepository
{
    private IDbContextTransaction? Transaction;

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
        return !await dbContext.Links.AnyAsync(l => l.Hash == hash);
    }

    public async Task UpdateLinkCounterByHash(string hash)
    {
        await dbContext.Links.Where(l => l.Hash == hash).ExecuteUpdateAsync(
            setters => setters.SetProperty(
                l => l.Views, l => l.Views + 1
            )
        );
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

    public async Task<List<Link>> GetByHashList(IEnumerable<string> hashes)
    {
        return await dbContext.Links.Where(l => hashes.Contains(l.Hash)).ToListAsync();
    }

    public async Task Update(Link link)
    {
        dbContext.Links.Update(link);
        await dbContext.SaveChangesAsync();
    }

    public void BeginTransaction()
    {
        Transaction = dbContext.Database.BeginTransaction();
    }

    public async Task Commit()
    {
        if (Transaction == null) return;
        await Transaction.CommitAsync();
    }
}