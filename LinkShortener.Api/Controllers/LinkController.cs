using AutoMapper;
using LinkShortner.Domain.Commands;
using LinkShortner.Domain.Exceptions;
using LinkShortner.Domain.Queries;
using LinkShortner.Domain.Results;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinkShortner.Api.Controllers;

[ApiController, Route("links")]
public class LinkController(IMapper mapper, IMediator mediator) : BaseController
{
    [HttpGet("{hash}")]
    public async Task GetLink(string hash)
    {
        var command = new GetByHashQuery(hash);
        
        try
        {
            var result = await mediator.Send(command);
            HttpContext.Response.Redirect(result.Href);
        }
        catch (NotFoundException e)
        {
            HttpContext.Response.Redirect("/");
        }
    }
    
    [HttpGet, Authorize]
    public async Task<List<LinkResumed>> GetUserLinks()
    {
        var user = await GetUser();
        var query = new GetUserLinksQuery { Actor = user };
        var links = await mediator.Send(query);

        return mapper.Map<List<LinkResumed>>(links);
    }

    [HttpPost, Authorize]
    public async Task<LinkResumed> CreateLink(CreateLinkCommand command)
    {
        var user = await GetUser();
        command.Actor = user;
        var result = await mediator.Send(command);

        return mapper.Map<LinkResumed>(result);
    }

    [HttpDelete("{linkId:Guid}"), Authorize]
    public async Task<string> DeleteLink(Guid linkId)
    {
        var user = await GetUser();
        var command = new DeleteLinkCommand { Actor = user, LinkId = linkId };
        await mediator.Send(command);

        return "Link deletado com sucesso!";
    }
}