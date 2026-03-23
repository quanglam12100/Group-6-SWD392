using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class KitchenOrderDto
    {
        public int OrderId { get; set; }
        public string TableName { get; set; }
        public int? StaffId { get; set; }
        public string OrderTime { get; set; } // Trả về chuỗi giờ phút cho dễ hiển thị (VD: 10:30)
        public List<KitchenItemDto> Items { get; set; } = new List<KitchenItemDto>();
    }
}
