using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Models;

namespace SmartRestaurant.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly SmartRestaurantDbContext _context;

    public PaymentsController(SmartRestaurantDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // CHECKOUT THEO ORDER ID
    // POST: api/Payments/checkout/{orderId}
    // =====================================================
    [HttpPost("checkout/{orderId}")]
    public async Task<IActionResult> CheckoutByOrder(
        int orderId,
        [FromBody] CheckoutRequest request)
    {
        var order = await _context.Orders
            .Include(o => o.Table)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return NotFound(new { message = $"Order {orderId} không tồn tại." });
        }

        if (order.PaymentStatus == "paid")
        {
            return BadRequest(new { message = "Order đã được thanh toán." });
        }

        // ================= TÍNH LẠI TỔNG TIỀN =================
        if (order.TotalAmount == null || order.TotalAmount == 0)
        {
            var details = await _context.OrderDetails
                .Where(d => d.OrderId == order.Id && d.Status != "cancelled")
                .Include(d => d.ProductVariant)
                .Include(d => d.OrderDetailToppings)
                .ToListAsync();

            decimal sum = 0;
            foreach (var d in details)
            {
                decimal unitPrice = d.ProductVariant?.Price ?? 0;
                decimal toppingTotal = d.OrderDetailToppings.Sum(t => t.PriceAtPurchase ?? 0) * (d.Quantity ?? 0);
                sum += (unitPrice * (d.Quantity ?? 0)) + toppingTotal;
            }

            order.TotalAmount = sum;
        }

        // ================= CẬP NHẬT THANH TOÁN =================
        order.PaymentStatus = "paid";
        order.PaymentMethod = string.IsNullOrWhiteSpace(request?.PaymentMethod)
            ? "cash"
            : request.PaymentMethod;

        order.ClosedAt = DateTime.UtcNow;

        // ================= MỞ LẠI BÀN =================
        if (order.Table != null)
        {
            order.Table.Status = "available";
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Thanh toán thành công",
            orderId = order.Id,
            totalAmount = order.TotalAmount,
            paymentMethod = order.PaymentMethod,
            closedAt = order.ClosedAt
        });
    }

    // =====================================================
    // DOANH THU THEO NGÀY
    // GET: api/Payments/revenue/daily?date=2025-03-01
    // =====================================================
    [HttpGet("revenue/daily")]
    public async Task<IActionResult> GetDailyRevenueAsync([FromQuery] DateTime? date)
    {
        var targetDate = (date ?? DateTime.UtcNow).Date;

        var paidOrders = await _context.Orders
            .Where(o =>
                o.PaymentStatus == "paid" &&
                o.ClosedAt.HasValue &&
                o.ClosedAt.Value.Date == targetDate)
            .ToListAsync();

        var total = paidOrders.Sum(o => o.TotalAmount ?? 0);

        return Ok(new
        {
            date = targetDate,
            totalRevenue = total,
            paidOrderCount = paidOrders.Count
        });
    }

    // =====================================================
    // DOANH THU THEO THÁNG
    // GET: api/Payments/revenue/monthly?year=2025&month=3
    // =====================================================
    [HttpGet("revenue/monthly")]
    public async Task<IActionResult> GetMonthlyRevenueAsync(
        [FromQuery] int year,
        [FromQuery] int month)
    {
        if (year <= 0 || month < 1 || month > 12)
        {
            return BadRequest(new { message = "Year/month không hợp lệ." });
        }

        var paidOrders = await _context.Orders
            .Where(o =>
                o.PaymentStatus == "paid" &&
                o.ClosedAt.HasValue &&
                o.ClosedAt.Value.Year == year &&
                o.ClosedAt.Value.Month == month)
            .ToListAsync();

        var total = paidOrders.Sum(o => o.TotalAmount ?? 0);

        return Ok(new
        {
            year,
            month,
            totalRevenue = total,
            paidOrderCount = paidOrders.Count
        });
    }
}