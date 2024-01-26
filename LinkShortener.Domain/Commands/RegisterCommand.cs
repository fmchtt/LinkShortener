using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Results;
using MediatR;

namespace LinkShortner.Domain.Commands;

public record RegisterCommand(string Name, string Email, string Password) : IRequest<TokenResult>;