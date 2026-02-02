using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class CreateOrderDto
    {
        public int? TableId { get; set; }
        public int? StaffId { get; set; } 
        public int? CustomerId { get; set; } 
        public List<CartItemDto> Items { get; set; } = new();
    }
}
