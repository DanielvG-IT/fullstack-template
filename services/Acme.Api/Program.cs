using Acme.Contracts;

var builder = WebApplication.CreateBuilder(args);

// Don't advertise the server stack in response headers.
builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Unhandled exceptions and bare status codes (404, 405, …) become RFC 9457 problem details,
// without leaking stack traces outside Development.
app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    // TLS is expected to terminate at the host/proxy; HSTS tells browsers to never downgrade.
    app.UseHsts();
}

app.MapHealthChecks("/health");

var api = app.MapGroup("/api");

api.MapGet("/ping", () => new PingResponse("pong", DateTimeOffset.UtcNow))
    .WithName("Ping");

app.Run();

// Exposes Program to WebApplicationFactory in Acme.Api.Tests.
public partial class Program;
