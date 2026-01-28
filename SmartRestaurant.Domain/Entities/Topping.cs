using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class Topping
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public bool? IsAvailable { get; set; }

    public virtual ICollection<OrderDetailTopping> OrderDetailToppings { get; set; } = new List<OrderDetailTopping>();
}
