using System;

namespace SmartRestaurant.Models;

public class CreateOrderDetailRequest
{
    public int OrderId { get; set; }
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; } = 1;
    public string? VoiceNote { get; set; }
}

public class UpdateOrderDetailStatusRequest
{
    /// <summary>
    /// New status for the item. Expected values: "pending", "cooking", "ready", "served".
    /// </summary>
    public string Status { get; set; } = string.Empty;
}

public class KitchenOrderItemResponse
{
    public int Id { get; set; }
    public string? OrderCode { get; set; }
    public int? TableId { get; set; }
    public string? TableName { get; set; }
    public string? ProductName { get; set; }
    public string? SizeName { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? OrderedAt { get; set; }
}

