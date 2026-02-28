using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Domain.Entities;
using SmartRestaurant.Application.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(SmartRestaurantDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // ================= LOGIN =================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Username == request.Username &&
                x.Password == request.Password
            );

        if (user == null)
            return Unauthorized("Invalid username or password");

        if (user.IsActive != true)
            return Unauthorized("Account disabled");

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            user.Id,
            user.Username,
            user.Role
        });
    }

    // ================= REGISTER =================
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var exists = await _context.Accounts
            .AnyAsync(x => x.Username == request.Username);

        if (exists)
            return BadRequest("Username already exists");

        var allowedRoles = new[] { "admin", "staff", "kitchen" };
        var role = request.Role?.ToLower();

        if (string.IsNullOrEmpty(role) || !allowedRoles.Contains(role))
            return BadRequest("Invalid role");

        var account = new Account
        {
            Username = request.Username,
            Password = request.Password, // 👈 Plain text (dễ nhìn)
            Fullname = request.Fullname,
            Role = role,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Register success",
            account.Id,
            account.Username,
            account.Role
        });
    }

    // ================= JWT TOKEN =================
    private string GenerateJwtToken(Account user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username ?? ""),
            new Claim(ClaimTypes.Role, user.Role ?? "staff")
        };

        var jwtKey = _config["Jwt:Key"] ?? "SMARTRESTAURANT_SECRET_KEY_12345";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(6),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
