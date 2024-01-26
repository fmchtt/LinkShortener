using System.Text.Json.Serialization;
using LinkShortner.Domain.Entities;
using MediatR;

namespace LinkShortner.Domain.Commands;

public class CreateLinkCommand : IRequest<Link>
{
    public string Href { get; set; } = string.Empty;
    [JsonIgnore] public User Actor { get; set; } = new();
}