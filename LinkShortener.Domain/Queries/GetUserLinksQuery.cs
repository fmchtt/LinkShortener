using System.Text.Json.Serialization;
using LinkShortner.Domain.Entities;
using MediatR;

namespace LinkShortner.Domain.Queries;

public class GetUserLinksQuery : IRequest<List<Link>>
{
    [JsonIgnore] public User Actor { get; set; } = new();
};