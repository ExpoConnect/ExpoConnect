using System;
using Microsoft.Maui.Controls;
using QR.Api;

namespace QR;

public partial class RegisterPage : ContentPage
{
    private readonly IAuthApi _authApi;

    public RegisterPage(IAuthApi authApi)
    {
        InitializeComponent();
        _authApi = authApi;
    }

    private async void OnSubmitClicked(object sender, EventArgs e)
    {
        string email = EmailEntry.Text;
        string password = PasswordEntry.Text;
        string displayName = DisplayNameEntry.Text;

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(displayName))
        {
            await DisplayAlert("Error", "Please fill in all fields", "OK");
            return;
        }

        try
        {
            var request = new RegisterRequestDto
            {
                Email = email,
                Password = password,
                DisplayName = displayName
            };

            var result = await _authApi.RegisterAsync(request);

            await SecureStorage.SetAsync("access_token", result.AccessToken);
            await SecureStorage.SetAsync("refresh_token", result.RefreshToken);

            await DisplayAlert("Success", "Registered successfully!", "OK");

            await Navigation.PopAsync();
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", ex.Message, "OK");
        }
    }

    private async void OnGoToLoginClicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new LoginPage(_authApi));
    }
}
