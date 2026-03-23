using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class CreateOrderResponseDto
    {
        public int OrderId { get; set; }
        public int? StaffId { get; set; }
        public string OrderCode { get; set; } = "";
        public string OrderType { get; set; } = "dine_in";
        public string? TableName { get; set; }
        public string? StaffName { get; set; }
        public DateTime CreatedAt { get; set; }

       
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? DeliveryStatus { get; set; }

       
        public List<BillItemDto> Items { get; set; } = new();

       
        public decimal SubTotal { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalItems { get; set; }
        public string PaymentStatus { get; set; } = "unpaid";
    }
}
