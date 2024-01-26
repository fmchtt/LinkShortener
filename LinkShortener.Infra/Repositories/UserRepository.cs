using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LinkShortner.Infra.Repositories;

public class UserRepository(LinkShortnerDbContext dbContext) : IUserRepository
{
    public async Task<User?> GetByEmail(string email)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetById(Guid id)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task Create(User user)
    {
        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(User user)
    {
        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync();
    }
}