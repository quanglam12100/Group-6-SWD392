using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IProductVariantRepository
    {
        Task<List<ProductVariant>> GetByIdsAsync(List<int> ids);
        Task<List<ProductVariant>> GetAllWithKeywordsAsync();
    }
}