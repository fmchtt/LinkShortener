using LinkShortner.Domain.Commands;
using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Exceptions;
using LinkShortner.Domain.Repositories;
using LinkShortner.Domain.Results;
using LinkShortner.Domain.Utilities;
using MediatR;

namespace LinkShortner.Domain.Handlers;

public class UserHandlers(IUserRepository userRepository, IHasher hasher, ITokenService tokenService) :
    IRequestHandler<LoginCommand, TokenResult>,
    IRequestHandler<RegisterCommand, TokenResult>
{
    public async Task<TokenResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByEmail(request.Email);
        NotFoundException.ThrowIfNull(user, "Usuário ou senha inválidos!");

        var valid = hasher.Validate(request.Password, user.Password);
        if (!valid)
        {
            throw new NotFoundException("Usuário ou senha inválidos!");
        }

        return new TokenResult(tokenService.GenerateToken(user));
    }

    public async Task<TokenResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByEmail(request.Email);
        if (user != null)
        {
            throw new AuthorizationException("Usuário inválido!");
        }

        var passwordHashed = hasher.Hash(request.Password);
        user = new User(request.Name, request.Email, passwordHashed);
        await userRepository.Create(user);

        return new TokenResult(tokenService.GenerateToken(user));
    }
}