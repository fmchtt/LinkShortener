using AutoMapper;
using LinkShortner.Domain.Commands;
using LinkShortner.Domain.Results;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinkShortner.Api.Controllers;

[ApiController, Route("users")]
public class UserController(IMapper mapper, IMediator mediator) : BaseController
{
    [HttpGet("me"), Authorize]
    public async Task<UserResumed> GetActualUser()
    {
        var user = await GetUser();
        return mapper.Map<UserResumed>(user);
    }

    [HttpPost("login")]
    public async Task<TokenResult> Login(LoginCommand command)
    {
        return await mediator.Send(command);
    }
    
    [HttpPost("register")]
    public async Task<TokenResult> Register(RegisterCommand command)
    {
        return await mediator.Send(command);
    }
}