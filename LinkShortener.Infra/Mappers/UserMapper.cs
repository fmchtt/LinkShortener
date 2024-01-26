using AutoMapper;
using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Results;

namespace LinkShortner.Infra.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<User, UserResumed>();
    }
}