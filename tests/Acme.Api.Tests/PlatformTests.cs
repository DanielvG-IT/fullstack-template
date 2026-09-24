using System.Net;

using Microsoft.AspNetCore.Mvc.Testing;

namespace Acme.Api.Tests;

public sealed class PlatformTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await factory.CreateClient().GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UnknownRoute_ReturnsProblemDetails()
    {
        var response = await factory.CreateClient().GetAsync("/does-not-exist");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Responses_DoNotAdvertiseServer()
    {
        var response = await factory.CreateClient().GetAsync("/health");

        Assert.False(response.Headers.Contains("Server"));
    }
}
