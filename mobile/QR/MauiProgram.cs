using Microsoft.Extensions.Logging;
using ZXing.Net.Maui.Controls;
using QR.Api;
namespace QR
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();

            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                })
                .UseBarcodeReader();  

           
            builder.Services.AddSingleton(sp =>
                new HttpClient
                {
                    BaseAddress = new Uri("http://10.0.2.2:5027/api/")
                });
          

            builder
                .UseMauiApp<App>()
                .UseBarcodeReader();
            //כשמישהו מבקש IAuthApi → תן לו AuthApi
            builder.Services.AddSingleton<IAuthApi, AuthApi>();
            builder.Services.AddSingleton<ICatalogApi, CatalogApi>();
            builder.Services.AddTransient<UsersCatalogsPage>();
            builder.Services.AddTransient<LoginOptionsPage>();
            builder.Services.AddTransient<LoginPage>();



#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}
