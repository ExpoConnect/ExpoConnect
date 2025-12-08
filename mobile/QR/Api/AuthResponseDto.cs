//using Xamarin.Google.Crypto.Tink.Shaded.Protobuf;

namespace QR.Api;

public class AuthResponseDto
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
}
