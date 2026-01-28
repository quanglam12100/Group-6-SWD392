using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Infrastructure.Data;
using System.Buffers.Text;
using static System.Net.Mime.MediaTypeNames;

namespace SmartRestaurant.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;

    public TestController(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    [HttpGet("connection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            // Test connection
            await _context.Database.CanConnectAsync();

            // Count products
            var productCount = await _context.Products.CountAsync();

            return Ok(new
            {
                message = "✅ Database connected successfully!",
                productCount = productCount
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = "❌ Database connection failed",
                error = ex.Message
            });
        }
    }
}
