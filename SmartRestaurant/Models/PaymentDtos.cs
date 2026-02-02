using System;

namespace SmartRestaurant.Models;

public class CheckoutRequest
{
    /// <summary>
    /// Table to checkout (close).
    /// </summary>
    public int TableId { get; set; }

    /// <summary>
    /// Optional payment method, e.g. "cash", "card", "momo".
    /// </summary>
    public string? PaymentMethod { get; set; }
}

public class RevenueDailyResponse
{
    public DateTime Date { get; set; }
    public decimal TotalRevenue { get; set; }
    public int PaidOrderCount { get; set; }
}

public class RevenueMonthlyResponse
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal TotalRevenue { get; set; }
    public int PaidOrderCount { get; set; }
}

