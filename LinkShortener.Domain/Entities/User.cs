using LinkShortner.Domain.Utilities;

namespace LinkShortner.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public virtual List<Link> Links { get; set; } = [];
    
    public User() {}
    public User(string name, string email, string password)
    {
        Id = new Guid();
        Name = name;
        Email = email;
        Password = password;
    }
}