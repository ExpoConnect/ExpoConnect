using QR.Api;

namespace QR;

public partial class AddNewItemPage : ContentPage
{
    private readonly ICatalogApi _catalogApi;
    private readonly Guid _catalogId;

    public AddNewItemPage(ICatalogApi catalogApi, Guid catalogId)
    {
        InitializeComponent();
        _catalogApi = catalogApi;
        _catalogId = catalogId;
    }

    private async void OnAddItemClicked(object sender, EventArgs e)
    {
        string name = NameEntry.Text;
        string desc = DescriptionEntry.Text;
        string category = CategoryEntry.Text;
        string priceStr = PriceEntry.Text;
        string imageUrl = ImageUrlEntry.Text;
        string featuresStr = FeaturesEntry.Text;

        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(priceStr))
        {
            await DisplayAlert("Error", "Name and Price are required.", "OK");
            return;
        }

        if (!decimal.TryParse(priceStr, out decimal price))
        {
            await DisplayAlert("Error", "Invalid price format.", "OK");
            return;
        }

        var request = new CreateItemRequestDto
        {
            Name = name,
            Description = desc,
            Category = category,
            Price = price,
            ImageUrl = imageUrl,
            Features = featuresStr?
                .Split(',')
                .Select(f => f.Trim())
                .Where(f => !string.IsNullOrWhiteSpace(f))
                .ToArray() ?? Array.Empty<string>()
        };

        try
        {
            var item = await _catalogApi.AddItemAsync(_catalogId, request);

            await DisplayAlert("Success",
                $"Item '{item.Name}' added successfully!",
                "OK");

            await Navigation.PopAsync();
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", ex.Message, "OK");
        }
    }
}
