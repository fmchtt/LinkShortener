﻿namespace LinkShortner.Domain.Entities;

public class Link
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Hash { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public int Views { get; set; } = 0;
    public Guid OwnerId { get; set; } = Guid.Empty;
    public virtual User Owner { get; set; } = new();
    
    public Link() {}
    public Link(string href, string hash, User owner)
    {
        Id = new Guid();
        Href = href;
        Hash = hash;
        OwnerId = owner.Id;
    }
}