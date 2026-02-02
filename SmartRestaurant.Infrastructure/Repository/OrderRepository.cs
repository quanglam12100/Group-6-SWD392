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
    }
}
