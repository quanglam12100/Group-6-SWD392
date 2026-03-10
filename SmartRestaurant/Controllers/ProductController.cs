using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Domain.Entities;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;

    public ProductController(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    // ================= GET ALL =================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.ProductVariants)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,

                Variants = p.ProductVariants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    SizeName = v.SizeName,
                    Price = v.Price
                }).ToList()
            })
            .ToListAsync();

        return Ok(products);
    }

    // ================= GET BY ID =================
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var p = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.ProductVariants)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p == null) return NotFound();

        var result = new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            ImageUrl = p.ImageUrl,
            IsActive = p.IsActive,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name,

            Variants = p.ProductVariants.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                SizeName = v.SizeName,
                Price = v.Price
            }).ToList()
        };

        return Ok(result);
    }

    // ================= CREATE =================
    [HttpPost]
    public async Task<IActionResult> Create(ProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            IsActive = dto.IsActive,
            CategoryId = dto.CategoryId,
            ProductVariants = dto.Variants.Select(v => new ProductVariant
            {
                SizeName = v.SizeName,
                Price = v.Price
            }).ToList()
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(product.Id);
    }

    // ================= UPDATE =================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProductDto dto)
    {
        var product = await _context.Products
            .Include(x => x.ProductVariants)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (product == null) return NotFound();

        // update product
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.ImageUrl = dto.ImageUrl;
        product.IsActive = dto.IsActive;
        product.CategoryId = dto.CategoryId;

        // xoá variant cũ
        _context.ProductVariants.RemoveRange(product.ProductVariants);

        // thêm variant mới
        product.ProductVariants = dto.Variants.Select(v => new ProductVariant
        {
            SizeName = v.SizeName,
            Price = v.Price
        }).ToList();

        await _context.SaveChangesAsync();

        return Ok("Update thành công");
    }

    // ================= DELETE =================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // 1. Tìm Product, nhớ .Include() thêm bảng Variants
        var product = await _context.Products
    .Include(p => p.ProductVariants)
    .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound("Không tìm thấy sản phẩm");
        }

        if (product.ProductVariants != null && product.ProductVariants.Any())
        {
            _context.RemoveRange(product.ProductVariants);
        }

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return Ok("Đã xóa sản phẩm thành công");
    }
}