using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;
using SmartRestaurant.Infrastructure.Data;

namespace SmartRestaurant.Infrastructure.Repository;

public class AccountRepository : IAccountRepository
{
    private readonly SmartRestaurantDbContext _context;

    public AccountRepository(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Account>> GetAccountsByRoleAsync(string role)
    {
        return await _context.Accounts
            .Where(a => a.Role == role)
            .ToListAsync();
    }

    public async Task<Account?> GetByIdAsync(int id)
    {
        return await _context.Accounts.FindAsync(id);
    }

    public async Task AddAsync(Account account)
    {
        await _context.Accounts.AddAsync(account);
    }

    public void Update(Account account)
    {
        _context.Accounts.Update(account);
    }

    public void Delete(Account account)
    {
        _context.Accounts.Remove(account);
    }
}
