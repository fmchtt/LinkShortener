using LinkShortner.Domain.Entities;

namespace LinkShortner.Domain.Repositories;

public interface IUserRepository
{
    public Task<User?> GetByEmail(string email);
    public Task<User?> GetById(Guid id);
    public Task Create(User user);
    public Task Delete(User user);
}