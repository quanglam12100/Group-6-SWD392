using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class OrderDetailTopping
{
    public int Id { get; set; }

    public int? OrderDetailId { get; set; }

    public int? ToppingId { get; set; }

    public decimal? PriceAtPurchase { get; set; }

    public virtual OrderDetail? OrderDetail { get; set; }

    public virtual Topping? Topping { get; set; }
}
