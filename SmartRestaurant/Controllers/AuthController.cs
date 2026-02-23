using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Temporary hardcoded validation (replace with database check later)
            if (request.Username == "admin@gmail.com" && request.Password == "admin123")
            {
                var token = GenerateJwtToken(request.Username, "Admin");
                return Ok(new { token, username = request.Username, role = "Admin" });
            }
            else if (request.Username == "manager@gmail.com" && request.Password == "manager123")
            {
                var token = GenerateJwtToken(request.Username, "Manager");
                return Ok(new { token, username = request.Username, role = "Manager" });
            }
            else if (request.Username == "staff@gmail.com" && request.Password == "staff123")
            {
                var token = GenerateJwtToken(request.Username, "Staff");
                return Ok(new { token, username = request.Username, role = "Staff" });
            }
            else if (request.Username == "kitchen@gmail.com" && request.Password == "kitchen123")
            {
                var token = GenerateJwtToken(request.Username, "kitchen");
                return Ok(new { token, username = request.Username, role = "kitchen" });
            }
            else if (request.Username == "customer@gmail.com" && request.Password == "customer123")
            {
                var token = GenerateJwtToken(request.Username, "customer");
                return Ok(new { token, username = request.Username, role = "customer" });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // Temporary: Just return success (implement database logic later)
            return Ok(new { message = "Registration successful", username = request.Username });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            return Ok(new { username, role });
        }

        private string GenerateJwtToken(string username, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not found");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var expirationHours = int.Parse(jwtSettings["ExpirationHours"] ?? "24");
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expirationHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}
