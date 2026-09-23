namespace Acme.Contracts;

/// <summary>Example DTO. Everything in this project is part of the public OpenAPI surface.</summary>
public sealed record PingResponse(string Message, DateTimeOffset ServerTime);
