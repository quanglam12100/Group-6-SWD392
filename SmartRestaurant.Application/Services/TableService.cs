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
        public async  Task<List<TableResponseDto>> GetAllTablesAsync()
        {
            var tables = await _unitOfWork.Tables.GetAllAsync();

            return tables.Select(t => new TableResponseDto
            {
                Id = t.Id,
                Name = t.Name ?? "",
                Status = t.Status
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
