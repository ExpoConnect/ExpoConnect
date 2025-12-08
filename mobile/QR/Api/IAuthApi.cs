

namespace QR.Api;

public interface IAuthApi
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<UserDto> MeAsync();
    Task<AuthResponseDto> RefreshAsync(RefreshRequestDto request);
}
