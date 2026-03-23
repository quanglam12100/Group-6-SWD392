using SmartRestaurant.Application.DTOs;

namespace SmartRestaurant.Application.Interfaces;

public interface IAccountService
{
    Task<IEnumerable<AccountResponseDto>> GetAccountsByRoleAsync(string role);
    Task<AccountResponseDto?> GetAccountByIdAsync(int id);
    Task<AccountResponseDto> CreateAccountAsync(CreateAccountDto dto);
    Task<bool> UpdateAccountAsync(int id, UpdateAccountDto dto);
    Task<bool> DeleteAccountAsync(int id);
}
