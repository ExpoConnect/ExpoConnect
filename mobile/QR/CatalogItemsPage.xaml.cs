using QR.Api;
using System.Collections.ObjectModel;

namespace QR;

public partial class CatalogItemsPage : ContentPage
{
    private readonly ICatalogApi _catalogApi;
    private readonly Guid _catalogId;

    public ObservableCollection<CatalogItemDto> Items { get; set; } = new();

    public CatalogItemsPage(ICatalogApi catalogApi, Guid catalogId)
    {
        InitializeComponent();

        _catalogApi = catalogApi;
        _catalogId = catalogId;

        ItemsCollection.ItemsSource = Items;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        await LoadItemsAsync();
    }

    private async Task LoadItemsAsync()
    {
        Items.Clear();

        var catalog = await _catalogApi.GetCatalogByIdAsync(_catalogId);

        Title = catalog.Name; 

        if (catalog.Items != null)
        {
            foreach (var item in catalog.Items)
                Items.Add(item);
        }
    }

    private async void OnAddItemClicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new AddNewItemPage(_catalogApi, _catalogId));
    }
}
