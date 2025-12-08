using QR.Api;

namespace QR;

public partial class LoginPage : ContentPage
{
    private readonly IAuthApi _authApi;

    public LoginPage(IAuthApi authApi)
    {
        InitializeComponent();
        _authApi = authApi;
    }

    private async void OnRegisterClicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new RegisterPage(_authApi));
    }

    private async void OnLoginClicked(object sender, EventArgs e)
    {
        string email = EmailEntry.Text;
        string password = PasswordEntry.Text;

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            await DisplayAlert("Error", "Please fill all fields", "OK");
            return;
        }

        try
        {
            var request = new LoginRequestDto
            {
                Email = email,
                Password = password
            };

            var result = await _authApi.LoginAsync(request);

            await SecureStorage.SetAsync("access_token", result.AccessToken);
            await SecureStorage.SetAsync("refresh_token", result.RefreshToken);

            await DisplayAlert("Welcome", "Login successful!", "OK");

            Application.Current.MainPage = new AppShell();
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", ex.Message, "OK");
        }
    }
}
