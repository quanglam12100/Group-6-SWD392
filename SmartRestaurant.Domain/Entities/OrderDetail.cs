using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class OrderDetail
{
    public int Id { get; set; }

    public int? OrderId { get; set; }

    public int? ProductVariantId { get; set; }

    public int? Quantity { get; set; }

    public string? VoiceNote { get; set; }

    public string? OriginalVoiceText { get; set; }

    public double? ConfidenceScore { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? OrderedAt { get; set; }

    public DateTime? CookingAt { get; set; }

    public DateTime? ReadyAt { get; set; }

    public DateTime? ServedAt { get; set; }

    public virtual Order? Order { get; set; }

    public virtual ICollection<OrderDetailTopping> OrderDetailToppings { get; set; } = new List<OrderDetailTopping>();

    public virtual ProductVariant? ProductVariant { get; set; }
}
