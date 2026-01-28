using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Domain.Entities;

[ApiController]
[Route("api/variants")]
public class ProductVariantController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;

    public ProductVariantController(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/variants/product/{productId}
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var variants = await _context.ProductVariants
            .Where(v => v.ProductId == productId)
            .ToListAsync();

        return Ok(variants);
    }

    // POST: api/variants
    [HttpPost]
    public async Task<IActionResult> Create(ProductVariant model)
    {
        _context.ProductVariants.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    // PUT: api/variants/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProductVariant model)
    {
        var variant = await _context.ProductVariants.FindAsync(id);
        if (variant == null) return NotFound();

        variant.SizeName = model.SizeName;
        variant.Price = model.Price;

        await _context.SaveChangesAsync();
        return Ok(variant);
    }

    // DELETE: api/variants/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var variant = await _context.ProductVariants.FindAsync(id);
        if (variant == null) return NotFound();

        _context.ProductVariants.Remove(variant);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
