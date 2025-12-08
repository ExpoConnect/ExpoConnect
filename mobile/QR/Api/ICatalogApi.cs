namespace QR.Api;

public interface ICatalogApi
{
    Task<List<CatalogDto>> GetCatalogsAsync();
    Task<CatalogDto> CreateCatalogAsync(CreateCatalogRequestDto request);
    Task<CatalogDto> GetCatalogByIdAsync(Guid catalogId);
    Task<CatalogItemDto> AddItemAsync(Guid catalogId, CreateItemRequestDto request);



}
