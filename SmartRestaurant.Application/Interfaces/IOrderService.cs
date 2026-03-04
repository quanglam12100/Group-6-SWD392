using SmartRestaurant.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IOrderService
    {
        Task<CreateOrderResponseDto> CreateOrderAsync(CreateOrderDto request);
        Task<CreateOrderResponseDto> CreateOnlineOrderAsync(CreateOnlineOrderDto request);
        Task<OrderDetailResponseDto> GetOrderByIdAsync(int id);

        Task CancelOrderAsync(int id);
        Task UpdateDeliveryStatusAsync(int id, string deliveryStatus);

        Task<List<OrderSummaryDto>> GetAllOrdersAsync();
        Task<List<OrderSummaryDto>> GetPaidOrdersAsync();

    }
}
