using LinkShortner.Domain.Handlers;
using LinkShortner.Domain.Repositories;
using LinkShortner.Domain.Utilities;
using LinkShortner.Infra.Mappers;
using LinkShortner.Infra.Repositories;
using LinkShortner.Infra.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LinkShortner.Infra;

public static class DependencyInjection
{
    public static IServiceCollection AddInfraestructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<LinkShortnerDbContext>(
            options =>
            {
                options.UseSqlServer(
                    configuration.GetConnectionString("LinkShortenerDb"),
                    x => x.MigrationsAssembly(typeof(LinkShortnerDbContext).Assembly.FullName)
                );
                options.UseLazyLoadingProxies();
            }
        );

        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<ILinkRepository, LinkRepository>();

        services.AddTransient<UserHandlers>();
        services.AddTransient<LinkHandlers>();

        services.AddAutoMapper(typeof(UserMapper));
        services.AddAutoMapper(typeof(LinkMapper));

        services.AddTransient<IHasher, Hasher>();
        services.AddTransient<ITokenService, TokenService>();

        services.AddMediatR(conf => conf.RegisterServicesFromAssembly(AppDomain.CurrentDomain.Load("LinkShortener.Domain")));

        return services;
    }
}