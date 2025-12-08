using Microsoft.Extensions.DependencyInjection;
using QR.Api;

namespace QR;

public partial class LoginOptionsPage : ContentPage
{
    private readonly ICatalogApi _catalogApi;

    public LoginOptionsPage(ICatalogApi catalogApi)
    {
        InitializeComponent();
        _catalogApi = catalogApi;
    }
   
    private async void OnGetCatalogClicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new GetCatalogs(_catalogApi));
    }

    private async void OnAddNewItemClicked(object sender, EventArgs e)
    {
      //  await Navigation.PushAsync(new AddNewItemPage(_catalogApi));
        await DisplayAlert("Error", "You must choose a catalog first.", "OK");
    }

      private async void OnUsersCatalodsClicked(object sender, EventArgs e)
     {
     
        await Navigation.PushAsync(
            new UsersCatalogsPage(_catalogApi)
        );
    }
}





