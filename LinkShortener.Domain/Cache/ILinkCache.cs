using LinkShortner.Domain.Entities;

namespace LinkShortner.Domain.Cache;

public interface ILinkCache
{
    public Task<string?> GetHrefByHash(string hash);
    public Task SaveHrefToCache(Link link);
}