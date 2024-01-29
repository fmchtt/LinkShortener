using LinkShortner.Domain.Cache;
using LinkShortner.Domain.Entities;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace LinkShortner.Infra.Cache;

public class RedisCache(IConfiguration configuration) : ILinkCache, IDisposable, IAsyncDisposable
{
    private ConnectionMultiplexer Connection { get; } = ConnectionMultiplexer.Connect(
        configuration.GetConnectionString("LinkShortenerCache") ??
        throw new ArgumentException("Connection String do cache não informado")
    );

    public async Task<string?> GetHrefByHash(string hash)
    {
        var db = Connection.GetDatabase();
        return await db.StringGetAsync(hash);
    }

    public async Task SaveHrefToCache(Link link)
    {
        var db = Connection.GetDatabase();
        await db.StringSetAsync(link.Hash, link.Href);
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