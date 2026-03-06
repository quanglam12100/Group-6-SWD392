using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class BillItemDto
    {
        public int OrderDetailId { get; set; }
        public string ProductName { get; set; } = "";   // Ví dụ: "Trà sữa"
        public string VariantName { get; set; } = "";   // Ví dụ: "Size L"
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }          // Giá 1 món (chưa gồm topping)
        public List<BillToppingDto> Toppings { get; set; } = new();
        public decimal ToppingTotal { get; set; }
        public decimal LineTotal { get; set; }
        public string Status { get; set; } = "pending"; // pending, cooking, ready, served, cancelled
        public string? VoiceNote { get; set; }          // Ghi chú: "ít đá", "nhiều đường"
    }
}
