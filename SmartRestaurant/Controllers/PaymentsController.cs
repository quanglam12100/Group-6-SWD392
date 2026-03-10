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
        if (order.TableId != null)
        {
            var table = await _context.Tables
                .FirstOrDefaultAsync(t => t.Id == order.TableId);

            if (table != null)
            {
                table.Status = "available";
            }
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
       
        var endDate = (date ?? DateTime.UtcNow).Date;
        var startDate = endDate.AddDays(-29); 

        
        var paidOrders = await _context.Orders
            .Where(o =>
                o.PaymentStatus == "paid" &&
                o.ClosedAt.HasValue &&
                o.ClosedAt >= startDate &&
                o.ClosedAt < endDate.AddDays(1))
            .ToListAsync();

        var result = new List<object>();

        for (int i = 0; i <= 29; i++)
        {
            var currentDate = startDate.AddDays(i);

           
            var dailyOrders = paidOrders
                .Where(o => o.ClosedAt.Value.Date == currentDate)
                .ToList();

            var total = dailyOrders.Sum(o => o.TotalAmount ?? 0);

            result.Add(new
            {
                date = currentDate.ToString("yyyy-MM-dd"), 
                totalRevenue = total,
                paidOrderCount = dailyOrders.Count
            });
        }

       
        return Ok(result);
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
        if (year <= 0)
        {
            return BadRequest(new { message = "Năm không hợp lệ." });
        }

        
        var startDate = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var endDate = startDate.AddYears(1);

        var paidOrders = await _context.Orders
            .Where(o =>
                o.PaymentStatus == "paid" &&
                o.ClosedAt.HasValue &&
                o.ClosedAt >= startDate &&
                o.ClosedAt < endDate)
            .ToListAsync();

       
        var result = new List<object>();

        for (int m = 1; m <= 12; m++)
        {
           
            var monthlyOrders = paidOrders
                .Where(o => o.ClosedAt.Value.Month == m)
                .ToList();

            var total = monthlyOrders.Sum(o => o.TotalAmount ?? 0);

            result.Add(new
            {
                year = year,
                month = m,
                totalRevenue = total,
                paidOrderCount = monthlyOrders.Count
            });
        }

        return Ok(result);
    }
}