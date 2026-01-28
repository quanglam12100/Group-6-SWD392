using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Models;
using SmartRestaurant.Realtime;

namespace SmartRestaurant.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KitchenController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;
    private readonly IHubContext<OrderHub> _hubContext;

    public KitchenController(SmartRestaurantDbContext context, IHubContext<OrderHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    /// <summary>
    /// API Lấy danh sách chờ (pending) cho bếp.
    /// </summary>
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<KitchenOrderItemResponse>>> GetPendingAsync()
    {
        var query =
            from detail in _context.OrderDetails
            where detail.Status == "pending"
            join order in _context.Orders on detail.OrderId equals order.Id
            join table in _context.Tables on order.TableId equals table.Id into tableJoin
            from table in tableJoin.DefaultIfEmpty()
            join variant in _context.ProductVariants on detail.ProductVariantId equals variant.Id into variantJoin
            from variant in variantJoin.DefaultIfEmpty()
            join product in _context.Products on variant.ProductId equals product.Id into productJoin
            from product in productJoin.DefaultIfEmpty()
            orderby detail.OrderedAt
            select new KitchenOrderItemResponse
            {
                Id = detail.Id,
                OrderCode = order.OrderCode,
                TableId = order.TableId,
                TableName = table.Name,
                ProductName = product.Name,
                SizeName = variant.SizeName,
                Quantity = detail.Quantity ?? 0,
                Status = detail.Status,
                OrderedAt = detail.OrderedAt
            };

        var items = await query.ToListAsync();
        return Ok(items);
    }

    /// <summary>
    /// Tạo mới một order detail (pending) cho bếp và bắn event new_order.
    /// </summary>
    [HttpPost("order-details")]
    public async Task<ActionResult<KitchenOrderItemResponse>> CreateOrderDetailAsync([FromBody] CreateOrderDetailRequest request)
    {
        var order = await _context.Orders.FindAsync(request.OrderId);
        if (order == null)
        {
            return NotFound($"Order {request.OrderId} không tồn tại.");
        }

        var detail = new Domain.Entities.OrderDetail
        {
            OrderId = request.OrderId,
            ProductVariantId = request.ProductVariantId,
            Quantity = request.Quantity,
            VoiceNote = request.VoiceNote,
            Status = "pending",
            OrderedAt = DateTime.UtcNow
        };

        _context.OrderDetails.Add(detail);
        await _context.SaveChangesAsync();

        // Load thêm thông tin hiển thị
        var response = await BuildKitchenItemResponse(detail.Id);

        // Bắn event realtime cho bếp
        await _hubContext.Clients.All.SendAsync("new_order", response);

        return CreatedAtAction(nameof(GetPendingAsync), new { id = detail.Id }, response);
    }

    /// <summary>
    /// API Đổi trạng thái món (Cooking/Ready/Served).
    /// Khi chuyển sang Ready sẽ bắn event order_ready.
    /// </summary>
    [HttpPut("order-details/{id:int}/status")]
    public async Task<IActionResult> UpdateStatusAsync(int id, [FromBody] UpdateOrderDetailStatusRequest request)
    {
        var normalizedStatus = request.Status?.Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(normalizedStatus) ||
            normalizedStatus is not ("pending" or "cooking" or "ready" or "served"))
        {
            return BadRequest("Trạng thái không hợp lệ. Cho phép: pending, cooking, ready, served.");
        }

        var detail = await _context.OrderDetails.FirstOrDefaultAsync(x => x.Id == id);
        if (detail == null)
        {
            return NotFound($"Order detail {id} không tồn tại.");
        }

        var previousStatus = detail.Status;
        detail.Status = normalizedStatus;

        var now = DateTime.UtcNow;
        switch (normalizedStatus)
        {
            case "cooking":
                detail.CookingAt = now;
                break;
            case "ready":
                detail.ReadyAt = now;
                break;
            case "served":
                detail.ServedAt = now;
                break;
        }

        await _context.SaveChangesAsync();

        var response = await BuildKitchenItemResponse(detail.Id);

        // Bắn event chung cho mọi thay đổi trạng thái
        await _hubContext.Clients.All.SendAsync("order_status_changed", new
        {
            id = response.Id,
            status = response.Status,
            response.TableId,
            response.TableName
        });

        // Khi Ready bắn thêm event order_ready riêng
        if (normalizedStatus == "ready")
        {
            await _hubContext.Clients.All.SendAsync("order_ready", response);
        }

        return Ok(response);
    }

    private async Task<KitchenOrderItemResponse> BuildKitchenItemResponse(int orderDetailId)
    {
        var query =
            from detail in _context.OrderDetails
            where detail.Id == orderDetailId
            join order in _context.Orders on detail.OrderId equals order.Id
            join table in _context.Tables on order.TableId equals table.Id into tableJoin
            from table in tableJoin.DefaultIfEmpty()
            join variant in _context.ProductVariants on detail.ProductVariantId equals variant.Id into variantJoin
            from variant in variantJoin.DefaultIfEmpty()
            join product in _context.Products on variant.ProductId equals product.Id into productJoin
            from product in productJoin.DefaultIfEmpty()
            select new KitchenOrderItemResponse
            {
                Id = detail.Id,
                OrderCode = order.OrderCode,
                TableId = order.TableId,
                TableName = table.Name,
                ProductName = product.Name,
                SizeName = variant.SizeName,
                Quantity = detail.Quantity ?? 0,
                Status = detail.Status,
                OrderedAt = detail.OrderedAt
            };

        var item = await query.FirstAsync();
        return item;
    }
}

