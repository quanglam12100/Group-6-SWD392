using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Domain.Entities;
using SmartRestaurant.Infrastructure.Data;

[ApiController]
[Route("api/toppings")]
public class ToppingController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;

    public ToppingController(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/toppings
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var toppings = await _context.Toppings.ToListAsync();
        return Ok(toppings);
    }

    // GET: api/toppings/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var topping = await _context.Toppings.FindAsync(id);

        if (topping == null)
            return NotFound("Topping not found");

        return Ok(topping);
    }

    // POST: api/toppings
    [HttpPost]
    public async Task<IActionResult> Create(Topping model)
    {
        _context.Toppings.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    // PUT: api/toppings/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Topping model)
    {
        var topping = await _context.Toppings.FindAsync(id);
        if (topping == null) return NotFound();

        topping.Name = model.Name;
        topping.Price = model.Price;
        topping.IsAvailable = model.IsAvailable;

        await _context.SaveChangesAsync();
        return Ok(topping);
    }

    // DELETE: api/toppings/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var topping = await _context.Toppings.FindAsync(id);
        if (topping == null) return NotFound();

        _context.Toppings.Remove(topping);
        await _context.SaveChangesAsync();
        return Ok("Deleted successfully");
    }
}
