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

            // 1️⃣ DÙNG HÀM CÓ KÈM DETAILS (Hàm mà bạn đã tạo ở bước trước)
            // Để đảm bảo lấy được đầy đủ OrderDetails, ProductVariant, Product...
            var orders = await _unitOfWork.Orders.GetAllOrdersWithDetailsAsync();

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
                    CurrentStaffId = t.CurrentStaffId,
                    CurrentStaffName = t.CurrentStaff?.Fullname ?? t.CurrentStaff?.Username,
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
                            .Sum(d => d.Quantity ?? 0),

                        Items = currentOrder.OrderDetails
                            .Where(d => d.Status != "cancelled")
                            .Select(d => new OrderItemDto
                            {
                                ProductName = d.ProductVariant?.Product?.Name != null
                                    ? (string.IsNullOrEmpty(d.ProductVariant.SizeName)
                                        ? d.ProductVariant.Product.Name
                                        : $"{d.ProductVariant.Product.Name} ({d.ProductVariant.SizeName})")
                                    : "Món ăn chưa rõ",
                                Quantity = d.Quantity ?? 0,
                                Price = d.ProductVariant?.Price ?? 0m
                            }).ToList()
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


        public async Task AssignTablesToStaffAsync(AssignTablesRequestDto request)
        {
            if (request == null || request.TableIds == null || !request.TableIds.Any())
                throw new ArgumentException("Dữ liệu không hợp lệ hoặc danh sách bàn trống.");

            var staff = await _unitOfWork.Accounts.GetByIdAsync(request.StaffId);
            if (staff == null)
                throw new KeyNotFoundException("Không tìm thấy tài khoản nhân viên này trong hệ thống.");

            var allTables = await _unitOfWork.Tables.GetAllAsync();

            var tablesToAssign = allTables.Where(t => request.TableIds.Contains(t.Id)).ToList();

            if (!tablesToAssign.Any())
                throw new KeyNotFoundException("Không tìm thấy các bàn được yêu cầu.");

            foreach (var table in tablesToAssign)
            {
                table.CurrentStaffId = request.StaffId;
                await _unitOfWork.Tables.UpdateAsync(table);
            }

            await _unitOfWork.CommitAsync();
        }

        public async Task ClearTablesAsync(List<int> tableIds)
        {
            if (tableIds == null || !tableIds.Any())
                throw new ArgumentException("Danh sách bàn trống.");

            var allTables = await _unitOfWork.Tables.GetAllAsync();
            var tablesToClear = allTables.Where(t => tableIds.Contains(t.Id)).ToList();

            foreach (var table in tablesToClear)
            {
                table.CurrentStaffId = null; 
                await _unitOfWork.Tables.UpdateAsync(table);
            }

            await _unitOfWork.CommitAsync();
        }
    }
}
