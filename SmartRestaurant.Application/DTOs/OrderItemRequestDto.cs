using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class OrderItemRequestDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public string? VoiceNote { get; set; }
        public string? OriginalVoiceText { get; set; }
        public List<int> ToppingIds { get; set; } = new List<int>();
    }
}
