using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
    }
}