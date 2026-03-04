using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class KitchenItemDto
    {
        public int OrderDetailId { get; set; }
        public string ProductName { get; set; } // Tên món + Size
        public int Quantity { get; set; }
        public string Status { get; set; }
        public string Note { get; set; } // Lấy từ VoiceNote
        public List<string> Toppings { get; set; } = new List<string>();
    }
}
