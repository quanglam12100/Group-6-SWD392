using Microsoft.EntityFrameworkCore;
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
    public class TableRepository : ITableRepository
    {
        private readonly SmartRestaurantDbContext _context;

        public TableRepository(SmartRestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<List<Table>> GetAllAsync()
        {
            return await _context.Tables
                .Include(t => t.CurrentStaff)
                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<Table?> GetByIdAsync(int id)
        {
            return await _context.Tables
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public Task UpdateAsync(Table table)
        {
            _context.Tables.Update(table);
            return Task.CompletedTask;
        }
    }
}
