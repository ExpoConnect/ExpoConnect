namespace QR.Api;

public class CatalogItemDto
{
    public Guid ItemId { get; set; }
    public Guid StandId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public string[] Features { get; set; }
}
