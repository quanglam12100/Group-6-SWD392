using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Application.DTOs;
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
                TableName = table != null ? table.Name : "Mang về",
                ProductName = product != null ? product.Name : "Sp không xác định",
                SizeName = variant != null ? variant.SizeName : "",
                Quantity = detail.Quantity ?? 0,
                Status = detail.Status,
                OrderedAt = detail.OrderedAt,

                
                VoiceNote = detail.VoiceNote, 

                
                Toppings = detail.OrderDetailToppings
                    .Where(odt => odt.Topping != null)
                    .Select(odt => new KitchenToppingResponse
                    {
                        Name = odt.Topping!.Name, 
                        Quantity = 1
                    }).ToList()
            };

        var items = await query.ToListAsync();
        return Ok(items);
    }


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

        
        var response = await BuildKitchenItemResponse(detail.Id);

        // Bắn event realtime cho bếp
        await _hubContext.Clients.All.SendAsync("new_order", response);

         return Created($"api/Kitchen/order-details/{detail.Id}", response);
    }

    
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

        await _hubContext.Clients.All.SendAsync("order_status_changed", new
        {
            id = response.Id,
            status = response.Status,
            response.TableId,
            response.TableName
        });

      
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


    [HttpGet("orders")]
    public async Task<IActionResult> GetKitchenOrders()
    {
        // Các trạng thái Bếp quan tâm
        var activeStatuses = new[] { "pending", "cooking", "ready" };

        var orders = await _context.Orders
            // Include các bảng liên quan để lấy tên bàn, tên món
            .Include(o => o.Table)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.ProductVariant) // Giả định ProductVariant liên kết Product
                    .ThenInclude(pv => pv.Product)    // Cần check lại tên biến Product trong ProductVariant
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.OrderDetailToppings)
                    .ThenInclude(odt => odt.Topping)  // Giả định OrderDetailToppings liên kết Topping
                                                      // Chỉ lấy đơn hàng có chứa món chưa hoàn thành
            .Where(o => o.OrderDetails.Any(od => activeStatuses.Contains(od.Status)))
            .OrderBy(o => o.CreatedAt)
            .Select(o => new KitchenOrderDto
            {
                OrderId = o.Id,
                // Nếu Table null thì ghi mang về hoặc tên khách
                TableName = o.Table != null ? o.Table.Name : "Mang về/Khách lẻ",
                OrderTime = o.CreatedAt.HasValue ? o.CreatedAt.Value.ToString("HH:mm") : "--:--",

                // Lọc lấy danh sách món cần làm trong Order đó
                Items = o.OrderDetails
                    .Where(od => activeStatuses.Contains(od.Status))
                    .Select(od => new KitchenItemDto
                    {
                        OrderDetailId = od.Id,

                        // LOGIC GHÉP TÊN: Tên món + (Size)
                        // Bạn kiểm tra lại biến .Product và .Name trong code ProductVariant của bạn nhé
                        ProductName = (od.ProductVariant != null && od.ProductVariant.Product != null)
                            ? $"{od.ProductVariant.Product.Name} ({od.ProductVariant.SizeName ?? "M"})"
                            : "Món không xác định",

                        Quantity = od.Quantity ?? 0,
                        Status = od.Status,
                        Note = od.VoiceNote, // Map VoiceNote sang Note hiển thị

                        // Lấy danh sách tên Topping
                        Toppings = od.OrderDetailToppings
                            .Where(odt => odt.Topping != null)
                            .Select(odt => odt.Topping.Name)
                            .ToList()
                    }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("update-status/{id}")]
        public async Task<IActionResult> UpdateItemStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var item = await _context.OrderDetails.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy món ăn này." });
            }

            // Kiểm tra trạng thái hợp lệ
            var validStatuses = new[] { "pending", "cooking", "ready", "served", "cancelled" };
            if (!validStatuses.Contains(request.Status))
            {
                return BadRequest(new { message = $"Trạng thái '{request.Status}' không hợp lệ." });
            }

            // Cập nhật trạng thái
            item.Status = request.Status;

            // Cập nhật thời gian tương ứng (Logic tự động điền giờ)
            var now = DateTime.Now;
            switch (request.Status)
            {
                case "cooking":
                    item.CookingAt = now;
                    break;
                case "ready":
                    item.ReadyAt = now;
                    break;
                case "served":
                    item.ServedAt = now;
                    break;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công", orderDetailId = id, newStatus = request.Status });
        }
    
}

