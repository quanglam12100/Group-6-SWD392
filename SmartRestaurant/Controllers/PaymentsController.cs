using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Models;
using SmartRestaurant.Application.Interfaces;

namespace SmartRestaurant.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;
    private readonly IOrderService _orderService;

    public PaymentsController(SmartRestaurantDbContext context, IOrderService orderService)
    {
        _context = context;
        _orderService = orderService;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
    }

    // =====================================================
    // LẤY TẤT CẢ LỊCH SỬ THANH TOÁN (CHECKOUTS)
    // GET: api/Payments/checkouts
    // =====================================================
    [HttpGet("checkouts")]
    public async Task<IActionResult> GetAllCheckouts()
    {
        var paidOrders = await _orderService.GetPaidOrdersAsync();
        return Ok(paidOrders);
>>>>>>> Stashed changes
    }

    // =====================================================
    // LẤY TẤT CẢ LỊCH SỬ THANH TOÁN (CHECKOUTS)
    // GET: api/Payments/checkouts
    // =====================================================
    [HttpGet("checkouts")]
    public async Task<IActionResult> GetAllCheckouts()
    {
        var paidOrders = await _orderService.GetPaidOrdersAsync();
        return Ok(paidOrders);
>>>>>>> Stashed changes
    }

    // =====================================================
    // LẤY TẤT CẢ LỊCH SỬ THANH TOÁN (CHECKOUTS)
    // GET: api/Payments/checkouts
    // =====================================================
    [HttpGet("checkouts")]
    public async Task<IActionResult> GetAllCheckouts()
    {
        var paidOrders = await _orderService.GetPaidOrdersAsync();
        return Ok(paidOrders);
    }

    /// <summary>
    /// API Checkout (Tính tiền, đóng bàn).
    /// - Tìm order đang mở của bàn.
    /// - Tính lại tổng tiền nếu cần.
    /// - Đánh dấu paid và giải phóng bàn.
    /// </summary>
    [HttpPost("checkout")]
    public async Task<IActionResult> CheckoutAsync([FromBody] CheckoutRequest request)
    {
        var table = await _context.Tables.FirstOrDefaultAsync(t => t.Id == request.TableId);
        if (table == null)
        {
            return NotFound($"Bàn {request.TableId} không tồn tại.");
        }

        // Lấy order mới nhất của bàn chưa thanh toán
        var order = await _context.Orders
            .Where(o => o.TableId == request.TableId && o.PaymentStatus != "paid")
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return BadRequest($"Không tìm thấy order đang mở cho bàn {request.TableId}.");
        }

        // Nếu total_amount đang null hoặc 0 thì tính lại từ chi tiết
        if (order.TotalAmount == null || order.TotalAmount == 0)
        {
            var totalFromDetails =
                from detail in _context.OrderDetails
                where detail.OrderId == order.Id
                join variant in _context.ProductVariants on detail.ProductVariantId equals variant.Id
                select (variant.Price ?? 0) * (detail.Quantity ?? 0);

            var sum = await totalFromDetails.SumAsync();

            // Cộng thêm topping nếu có
            var toppingsTotal =
                from dt in _context.OrderDetails
                where dt.OrderId == order.Id
                join odt in _context.OrderDetailToppings on dt.Id equals odt.OrderDetailId
                select (odt.PriceAtPurchase ?? 0);

            sum += await toppingsTotal.SumAsync();

            order.TotalAmount = sum;
        }

        order.PaymentStatus = "paid";
        order.PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? order.PaymentMethod : request.PaymentMethod;
        order.ClosedAt = DateTime.UtcNow;

        // Đóng bàn
        table.Status = "available";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Checkout thành công.",
            orderId = order.Id,
            tableId = table.Id,
            totalAmount = order.TotalAmount,
            paymentMethod = order.PaymentMethod,
            closedAt = order.ClosedAt
        });
    }

    /// <summary>
    /// Báo cáo doanh thu theo ngày.
    /// </summary>
    [HttpGet("revenue/daily")]
    public async Task<ActionResult<RevenueDailyResponse>> GetDailyRevenueAsync([FromQuery] DateTime? date)
    {
        var targetDate = (date ?? DateTime.UtcNow).Date;

        var paidOrders = await _context.Orders
            .Where(o =>
                o.PaymentStatus == "paid" &&
                o.ClosedAt.HasValue &&
                o.ClosedAt.Value.Date == targetDate)
            .ToListAsync();

        var total = paidOrders.Sum(o => o.TotalAmount ?? 0);

        var result = new RevenueDailyResponse
        {
            Date = targetDate,
            TotalRevenue = total,
            PaidOrderCount = paidOrders.Count
        };

        return Ok(result);
    }

    /// <summary>
    /// Báo cáo doanh thu theo tháng.
    /// </summary>
    [HttpGet("revenue/monthly")]
    public async Task<ActionResult<RevenueMonthlyResponse>> GetMonthlyRevenueAsync([FromQuery] int year, [FromQuery] int month)
    {
        if (year <= 0 || month is < 1 or > 12)
        {
            return BadRequest("Year/month không hợp lệ.");
        }

        var paidOrders = await _context.Orders
            .Where(o =>
                o.PaymentStatus == "paid" &&
                o.ClosedAt.HasValue &&
                o.ClosedAt.Value.Year == year &&
                o.ClosedAt.Value.Month == month)
            .ToListAsync();

        var total = paidOrders.Sum(o => o.TotalAmount ?? 0);

        var result = new RevenueMonthlyResponse
        {
            Year = year,
            Month = month,
            TotalRevenue = total,
            PaidOrderCount = paidOrders.Count
        };

        return Ok(result);
    }
}

