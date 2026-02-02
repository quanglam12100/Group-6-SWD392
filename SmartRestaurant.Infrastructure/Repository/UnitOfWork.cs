using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Infrastructure.Repository
{
    public class UnitOfWork :IUnitOfWork
    {
        private readonly SmartRestaurantDbContext _context;

        public IOrderRepository Orders { get; private set; }
        public IProductVariantRepository ProductVariants { get; private set; }
        public IToppingRepository Toppings { get; private set; }
        public UnitOfWork(SmartRestaurantDbContext context)
        {
            _context = context;

            Orders = new OrderRepository(_context);
            ProductVariants = new ProductVariantRepository(_context);
            Toppings = new ToppingRepository(_context);
        }

        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
