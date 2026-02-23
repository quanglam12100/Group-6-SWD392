using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Domain.Entities;
using SmartRestaurant.Infrastructure.Data;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ToppingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ToppingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Topping>>> GetToppings()
        {
            return await _context.Toppings.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Topping>> GetTopping(int id)
        {
            var topping = await _context.Toppings.FindAsync(id);

            if (topping == null)
            {
                return NotFound();
            }

            return topping;
        }

        [HttpPost]
        public async Task<ActionResult<Topping>> PostTopping(Topping topping)
        {
            topping.CreatedAt = DateTime.UtcNow;
            _context.Toppings.Add(topping);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopping), new { id = topping.Id }, topping);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTopping(int id, Topping topping)
        {
            if (id != topping.Id)
            {
                return BadRequest();
            }

            var existingTopping = await _context.Toppings.FindAsync(id);
            if (existingTopping == null)
            {
                return NotFound();
            }

            // Chỉ update các field cần thiết
            existingTopping.Name = topping.Name;
            existingTopping.Price = topping.Price;
            existingTopping.IsAvailable = topping.IsAvailable;
            existingTopping.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ToppingExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTopping(int id)
        {
            var topping = await _context.Toppings.FindAsync(id);
            if (topping == null)
            {
                return NotFound();
            }

            _context.Toppings.Remove(topping);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ToppingExists(int id)
        {
            return _context.Toppings.Any(e => e.Id == id);
        }
    }
}
