
using LinkShortner.Domain.Cache;
using LinkShortner.Domain.Repositories;

namespace LinkShortner.Api.Services;

class FlushCache(IServiceScopeFactory factory, ILogger<FlushCache> log) : BackgroundService
{
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    log.LogInformation("Cache flush service attached!");
    using PeriodicTimer timer = new(new TimeSpan(0, 10, 0));
    while (
      !stoppingToken.IsCancellationRequested &&
      await timer.WaitForNextTickAsync(stoppingToken))
    {
      await using var asyncScope = factory.CreateAsyncScope();
      var cache = asyncScope.ServiceProvider.GetRequiredService<ILinkCache>();
      var linkRepository = asyncScope.ServiceProvider.GetRequiredService<ILinkRepository>();
      await cache.FlushToDatabase(linkRepository);
    }
  }
}