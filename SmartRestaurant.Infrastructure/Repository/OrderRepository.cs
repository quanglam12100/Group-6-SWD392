using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;
using SmartRestaurant.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Infrastructure.Repository
{
    public class OrderRepository : IOrderRepository
    {

        private readonly SmartRestaurantDbContext _context;

        public OrderRepository(SmartRestaurantDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Table)
                .Include(o => o.Staff)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.ProductVariant)
                        .ThenInclude(v => v.Product)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.OrderDetailToppings)
                        .ThenInclude(t => t.Topping)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async  Task<IEnumerable<Order>> GetAllOrdersWithDetailsAsync()
        {
            return await _context.Orders
             .Include(o => o.Table)
             .Include(o => o.Staff)
             .Include(o => o.OrderDetails)
                 .ThenInclude(d => d.ProductVariant)
                     .ThenInclude(pv => pv.Product)
             .ToListAsync();
        }

        public async  Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
         .Include(o => o.Table)
         .Include(o => o.Staff)
         .Include(o => o.OrderDetails)
             .ThenInclude(d => d.ProductVariant)
                 .ThenInclude(v => v.Product)
         .Include(o => o.OrderDetails)
             .ThenInclude(d => d.OrderDetailToppings)
                 .ThenInclude(t => t.Topping)
         .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<KitchenStatsDto> GetKitchenStatsAsync()
        {
            var today = DateTime.Today;
            var stats = new KitchenStatsDto();

            // 1. Đếm số lượng theo trạng thái hiện tại (Real-time)
            stats.TotalPending = await _context.OrderDetails.CountAsync(od => od.Status == "pending");
            stats.TotalCooking = await _context.OrderDetails.CountAsync(od => od.Status == "cooking");
            stats.TotalReady = await _context.OrderDetails.CountAsync(od => od.Status == "ready");

            // 2. Thống kê theo ngày (Chỉ tính hôm nay)
            stats.TotalServedToday = await _context.OrderDetails
                .CountAsync(od => od.Status == "served" && od.ServedAt >= today);

            stats.TotalCancelledToday = await _context.OrderDetails
                .CountAsync(od => od.Status == "cancelled" && od.OrderedAt >= today);

            // 3. Tính thời gian nấu trung bình (Average Prep Time) của hôm nay
            // Tính từ lúc OrderedAt đến lúc ReadyAt
            var finishedItemsToday = await _context.OrderDetails
                .Where(od => (od.Status == "ready" || od.Status == "served")
                          && od.ReadyAt >= today
                          && od.OrderedAt != null
                          && od.ReadyAt != null)
                .Select(od => new { od.OrderedAt, od.ReadyAt })
                .ToListAsync();

            if (finishedItemsToday.Any())
            {
                double avgMinutes = finishedItemsToday
                    .Average(od => (od.ReadyAt!.Value - od.OrderedAt!.Value).TotalMinutes);

                stats.AveragePrepTimeMinutes = Math.Round(avgMinutes, 1); 
            }

            
            var longestWaitingItem = await _context.OrderDetails
                .Include(od => od.Order)
                .ThenInclude(o => o.Table) 
                .Where(od => (od.Status == "pending" || od.Status == "cooking") && od.OrderedAt != null)
                .OrderBy(od => od.OrderedAt) 
                .FirstOrDefaultAsync();

            if (longestWaitingItem != null)
            {
                if (longestWaitingItem.Order?.TableId != null)
                {
                    
                    stats.LongestWaitingTableName = $"Bàn {longestWaitingItem.Order.TableId}";
                }
                else
                {
                    stats.LongestWaitingTableName = "Mang đi / Delivery";
                }
            }

            return stats;
        }

        public async Task<KitchenStatsDto> GetKitchenStatsAsync(DateTime? filterDate = null)
        {
            // Lấy ngày cần lọc (nếu không truyền thì mặc định là hôm nay)
            var targetDate = filterDate?.Date ?? DateTime.Today;
            var nextDay = targetDate.AddDays(1); // Mốc ngày hôm sau để dùng cho phép toán nhỏ hơn (<)
            var isToday = targetDate == DateTime.Today;

            var stats = new KitchenStatsDto();

            // 1. Số lượng "Hiện tại" (Chỉ tính nếu đang xem ngày hôm nay)
            if (isToday)
            {
                stats.TotalPending = await _context.OrderDetails.CountAsync(od => od.Status == "pending");
                stats.TotalCooking = await _context.OrderDetails.CountAsync(od => od.Status == "cooking");
                stats.TotalReady = await _context.OrderDetails.CountAsync(od => od.Status == "ready");

                // Đã thêm điều kiện: od.Order.TableId != null để chỉ tính đơn ăn tại quán
                var longestWaitingItem = await _context.OrderDetails
                    .Include(od => od.Order).ThenInclude(o => o.Table)
                    .Where(od => (od.Status == "pending" || od.Status == "cooking")
                              && od.OrderedAt != null
                              && od.Order.TableId != null) // <--- Thêm dòng này
                    .OrderBy(od => od.OrderedAt)
                    .FirstOrDefaultAsync();

                stats.LongestWaitingTableName = longestWaitingItem?.Order?.Table?.Name ??
                                              (longestWaitingItem?.Order?.TableId != null ? $"Bàn {longestWaitingItem.Order.TableId}" : "Mang đi");
            }
            else
            {
                // Xem ngày quá khứ thì không còn món đang nấu hay chờ nữa
                stats.TotalPending = 0; stats.TotalCooking = 0; stats.TotalReady = 0;
                stats.LongestWaitingTableName = "Không có";
            }

            // 2. Thống kê theo ngày được chọn (targetDate)
            stats.TotalServedToday = await _context.OrderDetails
                .CountAsync(od => od.Status == "served" && od.ServedAt >= targetDate && od.ServedAt < nextDay);

            stats.TotalCancelledToday = await _context.OrderDetails
                .CountAsync(od => od.Status == "cancelled" && od.OrderedAt >= targetDate && od.OrderedAt < nextDay);

            // 3. Tính thời gian nấu trung bình trong ngày được chọn
            var finishedItems = await _context.OrderDetails
                .Where(od => (od.Status == "ready" || od.Status == "served")
                          && od.ReadyAt >= targetDate && od.ReadyAt < nextDay
                          && od.OrderedAt != null && od.ReadyAt != null)
                .Select(od => new { od.OrderedAt, od.ReadyAt })
                .ToListAsync();

            if (finishedItems.Any())
            {
                double avgMinutes = finishedItems.Average(od => (od.ReadyAt!.Value - od.OrderedAt!.Value).TotalMinutes);
                stats.AveragePrepTimeMinutes = Math.Round(avgMinutes, 1);
            }

            return stats;
        }

        public async Task<bool> HasUnpaidOrderAsync(int? tableId)
        {
            return await _context.Orders.AnyAsync(o =>
            o.TableId == tableId &&
            o.OrderType == "dine_in"&&
            o.PaymentStatus == "unpaid");



        }

        public void Remove(OrderDetail orderDetail)
        {
            _context.Set<OrderDetail>().Remove(orderDetail);
        }

        public   Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            return Task.CompletedTask;
        }
    }
}
