using LinkShortner.Domain.Entities;

namespace LinkShortner.Domain.Repositories;

public interface ILinkRepository
{
    public Task<Link?> GetByHash(string hash);
    public Task<Link?> GetById(Guid linkId);
    public Task<List<Link>> GetByOwner(Guid ownerId);
    public Task<bool> VerifyHash(string hash);
    public Task UpdateLinkCounterByHash(string hash);
    public Task Create(Link link);
    public Task Delete(Link link);
}