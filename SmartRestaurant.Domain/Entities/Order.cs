using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class Order
{
    public int Id { get; set; }

    public string? OrderCode { get; set; }

    public int? TableId { get; set; }

    public int? CustomerId { get; set; }

    public int? StaffId { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? PaymentMethod { get; set; }

    public string PaymentStatus { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? ClosedAt { get; set; }

    public string OrderType { get; set; } = null!;

    public string? CustomerName { get; set; }

    public string? CustomerPhone { get; set; }

    public string? DeliveryAddress { get; set; }

    public string? DeliveryStatus { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Account? Customer { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual Account? Staff { get; set; }

    public virtual Table? Table { get; set; }
}
