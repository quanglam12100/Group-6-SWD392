using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class AddOrderItemsDto
    {
        public List<OrderItemRequestDto> Items { get; set; } = new List<OrderItemRequestDto>();
    }

}
