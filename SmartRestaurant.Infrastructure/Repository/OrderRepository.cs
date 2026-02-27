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
        .OrderByDescending(o => o.CreatedAt)
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

        public   Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            return Task.CompletedTask;
        }
    }
}
