using System;
using System.Collections.Generic;

namespace SmartRestaurant.Domain.Entities;

public partial class VoiceLog
{
    public int Id { get; set; }

    public int? StaffId { get; set; }

    public string? AudioFileUrl { get; set; }

    public string? DetectedText { get; set; }

    public int? CorrectedProductId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool? IsTrained { get; set; }

    public virtual Product? CorrectedProduct { get; set; }

    public virtual Account? Staff { get; set; }
}
