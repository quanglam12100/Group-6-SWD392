using Microsoft.AspNetCore.Mvc;
using SmartRestaurant.Domain.Entities;
using SmartRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/categories")]
public class CategoryController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;

    public CategoryController(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _context.Categories.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(Category model)
    {
        _context.Categories.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Category model)
    {
        var item = await _context.Categories.FindAsync(id);
        if (item == null) return NotFound();

        item.Name = model.Name;
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Categories.FindAsync(id);
        if (item == null) return NotFound();

        _context.Categories.Remove(item);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
