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
    public class AccountRepository : IAccountRepository
    {
        private readonly SmartRestaurantDbContext _context;

        public AccountRepository(SmartRestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<Account?> GetByIdAsync(int id)
        {
           
            return await _context.Accounts.FindAsync(id);
        }
    }
}
