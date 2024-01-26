using System.Diagnostics.CodeAnalysis;

namespace LinkShortner.Domain.Exceptions;

public class NotFoundException(string? message) : Exception(message)
{
    public static void ThrowIfNull([NotNull] object? obj, string message)
    {
        if (obj == null) throw new NotFoundException(message);
    }
}