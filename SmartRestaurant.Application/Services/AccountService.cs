using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Services;

public class AccountService : IAccountService
{
    private readonly IUnitOfWork _unitOfWork;

    public AccountService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AccountResponseDto>> GetAccountsByRoleAsync(string role)
    {
        var accounts = await _unitOfWork.Accounts.GetAccountsByRoleAsync(role);
        return accounts.Select(a => new AccountResponseDto
        {
            Id = a.Id,
            Username = a.Username,
            Fullname = a.Fullname,
            Role = a.Role,
            CreatedAt = a.CreatedAt,
            IsActive = a.IsActive
        });
    }

    public async Task<AccountResponseDto?> GetAccountByIdAsync(int id)
    {
        var a = await _unitOfWork.Accounts.GetByIdAsync(id);
        if (a == null) return null;

        return new AccountResponseDto
        {
            Id = a.Id,
            Username = a.Username,
            Fullname = a.Fullname,
            Role = a.Role,
            CreatedAt = a.CreatedAt,
            IsActive = a.IsActive
        };
    }

    public async Task<AccountResponseDto> CreateAccountAsync(CreateAccountDto dto)
    {
        var account = new Account
        {
            Username = dto.Username,
            Password = dto.Password,
            Fullname = dto.Fullname,
            Role = dto.Role,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _unitOfWork.Accounts.AddAsync(account);
        await _unitOfWork.CommitAsync();

        return new AccountResponseDto
        {
            Id = account.Id,
            Username = account.Username,
            Fullname = account.Fullname,
            Role = account.Role,
            CreatedAt = account.CreatedAt,
            IsActive = account.IsActive
        };
    }

    public async Task<bool> UpdateAccountAsync(int id, UpdateAccountDto dto)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(id);
        if (account == null) return false;

        if (!string.IsNullOrEmpty(dto.Password))
            account.Password = dto.Password;
        
        if (!string.IsNullOrEmpty(dto.Fullname))
            account.Fullname = dto.Fullname;

        if (dto.IsActive.HasValue)
            account.IsActive = dto.IsActive.Value;

        _unitOfWork.Accounts.Update(account);
        await _unitOfWork.CommitAsync();
        return true;
    }

    public async Task<bool> DeleteAccountAsync(int id)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(id);
        if (account == null) return false;

        _unitOfWork.Accounts.Delete(account);
        await _unitOfWork.CommitAsync();
        return true;
    }
}
