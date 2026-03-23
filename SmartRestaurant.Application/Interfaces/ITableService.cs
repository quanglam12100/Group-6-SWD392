using SmartRestaurant.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Interfaces
{
    public interface ITableService
    {
        Task<List<TableResponseDto>> GetAllTablesAsync();
        Task UpdateTableStatusAsync(int id, string status);

        Task AssignTablesToStaffAsync(AssignTablesRequestDto request);
        Task ClearTablesAsync(List<int> tableIds);
    }
}
