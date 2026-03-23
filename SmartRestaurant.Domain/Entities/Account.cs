using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class Account
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? Fullname { get; set; }

    public string Role { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Order> OrderCustomers { get; set; } = new List<Order>();

    public virtual ICollection<Order> OrderStaffs { get; set; } = new List<Order>();

    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();

    public virtual ICollection<VoiceLog> VoiceLogs { get; set; } = new List<VoiceLog>();
}
