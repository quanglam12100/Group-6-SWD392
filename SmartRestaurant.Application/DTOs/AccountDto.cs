using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Fullname { get; set; }
        public string? Role { get; set; }
    }

    public class AccountResponseDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Fullname { get; set; }
        public string Role { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public bool? IsActive { get; set; }
    }

    public class CreateAccountDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Fullname { get; set; }
        public string Role { get; set; } = null!;
    }

    public class UpdateAccountDto
    {
        public string? Password { get; set; }
        public string? Fullname { get; set; }
        public bool? IsActive { get; set; }
    }
}