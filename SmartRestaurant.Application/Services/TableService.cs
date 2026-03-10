using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Services
{
    public class TableService : ITableService
    {
        private readonly IUnitOfWork _unitOfWork;

        private static readonly List<string> ValidStatuses = new()
        {
            "available", "occupied", "reserved"
        };

        public TableService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<List<TableResponseDto>> GetAllTablesAsync()
        {
            var tables = await _unitOfWork.Tables.GetAllAsync();
            var orders = await _unitOfWork.Orders.GetAllAsync();

            return tables.Select(t =>
            {
                var currentOrder = orders
                    .Where(o => o.TableId == t.Id && o.PaymentStatus == "unpaid")
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefault();

                return new TableResponseDto
                {
                    Id = t.Id,
                    Name = t.Name ?? "",

                    Status = currentOrder != null ? "occupied" : t.Status,

                    CurrentOrder = currentOrder == null ? null : new OrderSummaryDto
                    {
                        OrderId = currentOrder.Id,
                        OrderCode = currentOrder.OrderCode ?? "",
                        OrderType = currentOrder.OrderType ?? "dine_in",
                        TableName = currentOrder.Table?.Name,
                        StaffName = currentOrder.Staff?.Fullname,
                        CustomerName = currentOrder.CustomerName,
                        CustomerPhone = currentOrder.CustomerPhone,
                        DeliveryStatus = currentOrder.DeliveryStatus,
                        TotalAmount = (decimal)currentOrder.TotalAmount,
                        PaymentStatus = currentOrder.PaymentStatus,
                        CreatedAt = currentOrder.CreatedAt,
                        TotalItems = currentOrder.OrderDetails
                    .Where(d => d.Status != "cancelled")
                    .Sum(d => d.Quantity ?? 0)
                    }
                };
            }).ToList();
        }

        public async  Task UpdateTableStatusAsync(int id, string status)
        {
            if (!ValidStatuses.Contains(status))
                throw new ArgumentException(
                    $"Trạng thái không hợp lệ. Chỉ chấp nhận: {string.Join(", ", ValidStatuses)}");

            var table = await _unitOfWork.Tables.GetByIdAsync(id);

            if (table == null)
                throw new KeyNotFoundException($"Không tìm thấy bàn #{id}");

            table.Status = status;

            await _unitOfWork.Tables.UpdateAsync(table);
            await _unitOfWork.CommitAsync();
        }
    }
}
