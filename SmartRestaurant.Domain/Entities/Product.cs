using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class Product
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public bool? IsActive { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<ProductKeyword> ProductKeywords { get; set; } = new List<ProductKeyword>();

    public virtual ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();

    public virtual ICollection<VoiceLog> VoiceLogs { get; set; } = new List<VoiceLog>();
}
