using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task<Order?> GetByIdAsync(int id);         
        Task UpdateAsync(Order order);
        Task<List<Order>> GetAllAsync();
        Task<IEnumerable<Order>> GetAllOrdersWithDetailsAsync();

        void Remove(OrderDetail orderDetail);

        Task<bool> HasUnpaidOrderAsync(int? tableId);
        Task<KitchenStatsDto> GetKitchenStatsAsync(DateTime? filterDate = null);
    }
}