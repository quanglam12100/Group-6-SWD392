using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Infrastructure.Data;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly SmartRestaurantDbContext _context;

        public AccountsController(SmartRestaurantDbContext context)
        {
            _context = context;
        }

        [HttpGet("staffs")]
        public async Task<IActionResult> GetActiveStaffs()
        {
            // Chỉ lấy những tài khoản đang Active và có Role là "staff" (hoặc role bạn quy định)
            var staffs = await _context.Accounts
                .Where(a => a.IsActive == true && (a.Role == "staff" ))
                .Select(a => new AccountDto
                {
                    Id = a.Id,
                    Username = a.Username,
                    Fullname = a.Fullname,
                    Role = a.Role
                })
                .ToListAsync();

            return Ok(staffs);
        }
    }
}
