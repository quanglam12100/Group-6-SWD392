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
    public class ProductVariantRepository : IProductVariantRepository
    {
        private readonly SmartRestaurantDbContext _context;

        public ProductVariantRepository(SmartRestaurantDbContext context)
        {
            _context = context;
        }
        
        public async Task<List<ProductVariant>> GetAllAsync()
        {
            return await _context.ProductVariants
                .Include(v => v.Product)
                .ToListAsync();
        }

        public async Task<List<ProductVariant>> GetAllWithKeywordsAsync()
        {
            return await _context.ProductVariants
                .Include(v => v.Product)
                .ThenInclude(p => p.ProductKeywords)
                .Where(v => v.Product.IsActive == true)
                .ToListAsync();
        }

        public async Task<List<ProductVariant>> GetByIdsAsync(List<int> ids)
        {
            
            return await _context.ProductVariants
                .Include(v => v.Product)
                                 .Where(p => ids.Contains(p.Id))
                                 .ToListAsync();
        }
    }
}
