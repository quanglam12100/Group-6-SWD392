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
    public class ToppingRepository : IToppingRepository
    {
        private readonly SmartRestaurantDbContext _context;
        public ToppingRepository(SmartRestaurantDbContext context)
        {
            _context = context;
        }
        public async Task<List<Topping>> GetByIdsAsync(List<int> ids)
        {
            return await _context.Toppings
                                 .Where(t => ids.Contains(t.Id))
                                 .ToListAsync();
        }
    }
}
