using AutoMapper;
using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Results;

namespace LinkShortner.Infra.Mappers;

public class LinkMapper : Profile
{
    public LinkMapper()
    {
        CreateMap<Link, LinkResumed>();
    }
}