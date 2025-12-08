using QR.Api;

namespace QR;

public partial class GetCatalogs : ContentPage
{
    private readonly ICatalogApi _catalogApi;

    public GetCatalogs(ICatalogApi catalogApi)
    {
        InitializeComponent();
        _catalogApi = catalogApi;
    }

    private async void OnGetNameClicked(object sender, EventArgs e)
    {
        try
        {
            var catalogs = await _catalogApi.GetCatalogsAsync();

            if (catalogs == null || catalogs.Count == 0)
            {
                await DisplayAlert("Result", "No catalogs found", "OK");
                return;
            }

            var first = catalogs.First();
            await DisplayAlert("Catalog Name", first.Name, "OK");
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", ex.Message, "OK");
        }
    }
}
