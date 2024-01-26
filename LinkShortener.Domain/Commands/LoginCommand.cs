using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Results;
using MediatR;

namespace LinkShortner.Domain.Commands;

public record LoginCommand(string Email, string Password) : IRequest<TokenResult>;