using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace QR.Api;

public class CatalogApi : ICatalogApi
{
    private readonly HttpClient _client;

    public CatalogApi(HttpClient client)
    {
        _client = client;
    }

    public async Task<List<CatalogDto>> GetCatalogsAsync()
    {
        await AddAuthHeaderAsync();
        return await _client.GetFromJsonAsync<List<CatalogDto>>("catalogs");
    }
    public async Task<CatalogDto> CreateCatalogAsync(CreateCatalogRequestDto request)
    {
        var response = await _client.PostAsJsonAsync("catalogs", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<CatalogDto>();
    }
    //בטוח יותר מ־int:Guid
    public async Task<CatalogDto> GetCatalogByIdAsync(Guid catalogId)
    {
        await AddAuthHeaderAsync();
        return await _client.GetFromJsonAsync<CatalogDto>($"catalogs/{catalogId}");
    }

    public async Task<CatalogItemDto> AddItemAsync(Guid catalogId, CreateItemRequestDto request)
    {
        var response = await _client.PostAsJsonAsync($"catalogs/{catalogId}/items", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<CatalogItemDto>();
    }
    private async Task AddAuthHeaderAsync()
    {
        var token = await SecureStorage.GetAsync("access_token");
        if (!string.IsNullOrEmpty(token))
        {
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }
    }


}
