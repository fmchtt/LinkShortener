using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Repositories;

namespace LinkShortner.Domain.Cache;

public interface ILinkCache
{
    public Task<string?> GetHrefByHash(string hash);
    public Task SaveHrefToCache(Link link);
    public Task FlushToDatabase(ILinkRepository linkRepository);
}