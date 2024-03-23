using LinkShortner.Domain.Cache;
using LinkShortner.Domain.Commands;
using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Exceptions;
using LinkShortner.Domain.Queries;
using LinkShortner.Domain.Repositories;
using LinkShortner.Domain.Utilities;
using MediatR;

namespace LinkShortner.Domain.Handlers;

public class LinkHandlers(ILinkRepository linkRepository, IHasher hasher, ILinkCache linkCache) :
    IRequestHandler<CreateLinkCommand, Link>,
    IRequestHandler<DeleteLinkCommand>,
    IRequestHandler<GetUserLinksQuery, List<Link>>,
    IRequestHandler<GetByHashQuery, string>
{
    public async Task<Link> Handle(CreateLinkCommand request, CancellationToken cancellationToken)
    {
        var hashValid = false;
        var hash = "";
        while (!hashValid)
        {
            hash = hasher.GenerateHash();
            hashValid = await linkRepository.VerifyHash(hash);
        }

        var link = new Link(request.Href, hash, request.Actor);
        await linkRepository.Create(link);

        return link;
    }

    public async Task Handle(DeleteLinkCommand request, CancellationToken cancellationToken)
    {
        var link = await linkRepository.GetById(request.LinkId);
        NotFoundException.ThrowIfNull(link, "Link não encontrado!");

        if (link.OwnerId != request.Actor.Id)
        {
            throw new AuthorizationException("Você não tem permissão para apagar esse link!");
        }

        await linkRepository.Delete(link);
    }

    public async Task<List<Link>> Handle(GetUserLinksQuery request, CancellationToken cancellationToken)
    {
        return await linkRepository.GetByOwner(request.Actor.Id);
    }

    public async Task<string> Handle(GetByHashQuery request, CancellationToken cancellationToken)
    {
        var linkCached = await linkCache.GetHrefByHash(request.Hash);
        if (linkCached != null)
        {
            return linkCached;
        }

        var link = await linkRepository.GetByHash(request.Hash);
        NotFoundException.ThrowIfNull(link, "Hash não encontrado!");

        await linkCache.SaveHrefToCache(link);

        return link.Href;
    }
}