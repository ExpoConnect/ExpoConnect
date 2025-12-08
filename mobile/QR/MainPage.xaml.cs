using ZXing.Net.Maui;
using ZXing.Net.Maui.Controls;
using QR.Api;

namespace QR
{
    public partial class MainPage : ContentPage
    {
        private readonly IAuthApi _authApi;
        private readonly ICatalogApi _catalogApi;

        public MainPage(IAuthApi authApi, ICatalogApi catalogApi)
        {
            InitializeComponent();
            _authApi = authApi;
            _catalogApi = catalogApi;
        }

        private async void OnRegisterClicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new RegisterPage(_authApi));
        }

        private async void OnLoginClicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new LoginPage(_authApi));
        }
        private async void ConnectToDatabase(object sender, EventArgs e) { }
        private async void OnScanClicked(object sender, EventArgs e)
        {
            var scanner = new CameraBarcodeReaderView
            {
                Options = new BarcodeReaderOptions
                {
                    Formats = BarcodeFormat.Code128 | BarcodeFormat.QrCode | BarcodeFormat.Code39
                }
            };

            var tcs = new TaskCompletionSource<string>();

            scanner.BarcodesDetected += (s, args) =>
            {
                if (args.Results?.FirstOrDefault() is { } result)
                {
                    tcs.TrySetResult(result.Value);
                }
            };

            var scanPage = new ContentPage
            {
                Content = scanner
            };

            await Navigation.PushAsync(scanPage);

            var barcode = await tcs.Task;

            await Navigation.PopAsync();

            RsultLabel.Text = barcode;
        }
    }
}
