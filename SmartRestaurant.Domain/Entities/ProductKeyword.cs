using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class ProductKeyword
{
    public int Id { get; set; }

    public int? ProductId { get; set; }

    public string? Keyword { get; set; }

    public virtual Product? Product { get; set; }
}
