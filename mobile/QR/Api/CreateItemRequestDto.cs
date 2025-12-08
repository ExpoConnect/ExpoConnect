namespace QR.Api;

public class CreateItemRequestDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public string[] Features { get; set; }
}
