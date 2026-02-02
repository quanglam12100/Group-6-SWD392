using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IToppingRepository
    {
        Task<List<Topping>> GetByIdsAsync(List<int> ids);
    }
}