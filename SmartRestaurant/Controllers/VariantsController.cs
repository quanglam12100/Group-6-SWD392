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
    public class VariantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VariantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductVariant>>> GetVariants()
        {
            return await _context.ProductVariants
                .Include(v => v.Product)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductVariant>> GetVariant(int id)
        {
            var variant = await _context.ProductVariants
                .Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (variant == null)
            {
                return NotFound();
            }

            return variant;
        }

        [HttpPost]
        public async Task<ActionResult<ProductVariant>> PostVariant(ProductVariant variant)
        {
            variant.CreatedAt = DateTime.UtcNow;
            _context.ProductVariants.Add(variant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVariant), new { id = variant.Id }, variant);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVariant(int id, ProductVariant variant)
        {
            if (id != variant.Id)
            {
                return BadRequest();
            }

            var existingVariant = await _context.ProductVariants.FindAsync(id);
            if (existingVariant == null)
            {
                return NotFound();
            }

            // Chỉ update các field cần thiết
            existingVariant.ProductId = variant.ProductId;
            existingVariant.SizeName = variant.SizeName;
            existingVariant.Price = variant.Price;
            existingVariant.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VariantExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVariant(int id)
        {
            var variant = await _context.ProductVariants.FindAsync(id);
            if (variant == null)
            {
                return NotFound();
            }

            _context.ProductVariants.Remove(variant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VariantExists(int id)
        {
            return _context.ProductVariants.Any(e => e.Id == id);
        }
    }
}
