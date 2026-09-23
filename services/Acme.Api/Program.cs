using Acme.Contracts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/api/ping", () => new PingResponse("pong", DateTimeOffset.UtcNow))
    .WithName("Ping");

app.Run();

// Exposes Program to WebApplicationFactory in Acme.Api.Tests.
public partial class Program;
