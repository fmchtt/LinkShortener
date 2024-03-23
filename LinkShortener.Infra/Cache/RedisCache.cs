using LinkShortner.Domain.Cache;
using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace LinkShortner.Infra.Cache;

public class RedisCache(IConfiguration configuration, ILogger<RedisCache> logger) : ILinkCache, IDisposable, IAsyncDisposable
{
    private ConnectionMultiplexer Connection { get; } = ConnectionMultiplexer.Connect(
        configuration.GetConnectionString("LinkShortenerCache") ??
        throw new ArgumentException("Connection String do cache não informado")
    );

    public async Task<string?> GetHrefByHash(string hash)
    {
        var db = Connection.GetDatabase();
        var hashSet = await db.HashGetAsync($"link:{hash}", "href");
        if (hashSet.IsNullOrEmpty)
        {
            return null;
        }
        await db.HashIncrementAsync($"link:{hash}", "views", 1);
        return hashSet.ToString();
    }

    public async Task SaveHrefToCache(Link link)
    {
        var db = Connection.GetDatabase();
        await db.HashSetAsync($"link:{link.Hash}", [
            new HashEntry("href", link.Href),
            new HashEntry("views", link.Views + 1)
        ]);
    }

    public async Task FlushToDatabase(ILinkRepository linkRepository)
    {
        logger.LogInformation("Flush process initialized");
        var db = Connection.GetDatabase();
        var endpoint = Connection.GetEndPoints().First();
        var server = Connection.GetServer(endpoint);
        var keys = server.Keys(db.Database, "link:*");
        var hashes = keys.Select(x => x.ToString().Replace("link:", ""));
        if (hashes == null) { return; }
        linkRepository.BeginTransaction();
        var links = await linkRepository.GetByHashList(hashes);
        foreach (var key in keys)
        {
            var hash = key.ToString().Replace("link:", "");
            var views = await db.HashGetAsync(key, "views");
            var link = links.First(l => l.Hash == hash);
            views.TryParse(out int viewCount);
            logger.LogInformation("Link {Hash} views count saved from {PreviousCount} to {NewCount}", hash, link.Views, viewCount);
            link.Views = viewCount;
            await linkRepository.Update(link);
        }
        await linkRepository.Commit();
        logger.LogInformation("Flush process finalized");
    }

    public void Dispose()
    {
        Connection.Close();
        Connection.Dispose();
        GC.SuppressFinalize(this);
    }

    public async ValueTask DisposeAsync()
    {
        await Connection.CloseAsync();
        await Connection.DisposeAsync();
        GC.SuppressFinalize(this);
    }
}