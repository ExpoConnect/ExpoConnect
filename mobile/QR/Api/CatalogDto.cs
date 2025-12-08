namespace QR.Api;

public class CatalogDto
{
    public Guid CatalogId { get; set; }
    public string StandId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<CatalogItemDto> Items { get; set; }
}
