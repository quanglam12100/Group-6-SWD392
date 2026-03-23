using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Interfaces;

public interface IAccountRepository
{
    Task<Account?> GetByIdAsync(int id);
    Task<IEnumerable<Account>> GetAccountsByRoleAsync(string role);
    Task AddAsync(Account account);
    void Update(Account account);
    void Delete(Account account);
}