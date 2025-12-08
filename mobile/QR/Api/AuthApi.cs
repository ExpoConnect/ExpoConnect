//using Android.Service.Autofill;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace QR.Api;

public class AuthApi : IAuthApi
{
    private readonly HttpClient _client;

    public AuthApi(HttpClient client)
    {
        _client = client;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var response = await _client.PostAsJsonAsync("Auth/register", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<AuthResponseDto>();
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var response = await _client.PostAsJsonAsync("Auth/login", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<AuthResponseDto>();
    }


    public async Task<UserDto> MeAsync()
    {
        return await _client.GetFromJsonAsync<UserDto>("Auth/me");
    }

    public async Task<AuthResponseDto> RefreshAsync(RefreshRequestDto request)
    {
        await AddAuthHeaderAsync();

        var response = await _client.PostAsJsonAsync("Auth/refresh", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<AuthResponseDto>();
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
