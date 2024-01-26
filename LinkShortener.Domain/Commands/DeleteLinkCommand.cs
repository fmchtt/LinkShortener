using System.Text.Json.Serialization;
using LinkShortner.Domain.Entities;
using MediatR;

namespace LinkShortner.Domain.Commands;

public class DeleteLinkCommand : IRequest
{
    public Guid LinkId { get; set; } = Guid.Empty;
    [JsonIgnore] public User Actor { get; set; } = new();
}