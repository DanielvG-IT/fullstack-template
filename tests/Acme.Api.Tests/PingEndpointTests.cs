using System.Net.Http.Json;

using Acme.Contracts;

using Microsoft.AspNetCore.Mvc.Testing;

namespace Acme.Api.Tests;

public sealed class PingEndpointTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Ping_ReturnsPong()
    {
        var client = factory.CreateClient();

        var response = await client.GetFromJsonAsync<PingResponse>("/api/ping");

        Assert.Equal("pong", response?.Message);
    }
}
