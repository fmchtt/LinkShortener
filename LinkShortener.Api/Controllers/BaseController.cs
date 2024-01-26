using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Exceptions;
using LinkShortner.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LinkShortner.Api.Controllers;

public class BaseController : ControllerBase
{
    [NonAction]
    private Guid GetUserId()
    {
        var userId = User.Identity?.Name;
        return userId == null ? Guid.Empty : Guid.Parse(userId);
    }

    [NonAction]
    protected async Task<User> GetUser()
    {
        var userRepository = HttpContext.RequestServices.GetService<IUserRepository>();
        AuthorizationException.ThrowIfNull(userRepository, "Acesso não autorizado!");

        var userId = GetUserId();
        var user = await userRepository.GetById(userId);
        AuthorizationException.ThrowIfNull(user, "Acesso não autorizado!");

        return user;
    }
}