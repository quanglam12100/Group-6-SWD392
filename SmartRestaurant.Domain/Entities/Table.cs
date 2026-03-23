using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class Table
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string Status { get; set; } = null!;

    public int? CurrentStaffId { get; set; }

    public virtual Account? CurrentStaff { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
