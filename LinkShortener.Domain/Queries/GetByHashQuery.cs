using LinkShortner.Domain.Entities;
using MediatR;

namespace LinkShortner.Domain.Queries;

public record GetByHashQuery(string Hash) : IRequest<Link>;