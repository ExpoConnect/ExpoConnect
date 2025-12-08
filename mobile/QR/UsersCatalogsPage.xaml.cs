using QR.Api;
using System.Collections.ObjectModel;
//using Xamarin.Google.Crypto.Tink.Shaded.Protobuf;

namespace QR;

public partial class UsersCatalogsPage : ContentPage
{
    private readonly ICatalogApi _catalogApi;
    public ObservableCollection<CatalogDto> Catalogs { get; } = new();

    public UsersCatalogsPage(ICatalogApi catalogApi)
    {
        InitializeComponent();
        _catalogApi = catalogApi;
        CatalogsCollection.ItemsSource = Catalogs;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        try
        {
            var catalogsList = await _catalogApi.GetCatalogsAsync();

            Catalogs.Clear();
            foreach (var c in catalogsList)
                Catalogs.Add(c);
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", ex.Message, "OK");
        }
    }

    private async void CatalogSelected(object sender, SelectionChangedEventArgs e)
    {
        if (e.CurrentSelection.FirstOrDefault() is CatalogDto catalog)
        {
            await Navigation.PushAsync(new CatalogItemsPage(_catalogApi, catalog.CatalogId));
            CatalogsCollection.SelectedItem = null;
        }
    }
}
