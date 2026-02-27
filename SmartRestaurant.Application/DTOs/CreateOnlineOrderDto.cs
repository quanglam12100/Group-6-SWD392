using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public  class CreateOnlineOrderDto
    {
        public string CustomerName { get; set; } = "";        
        public string CustomerPhone { get; set; } = "";       
        public string DeliveryAddress { get; set; } = "";     
        public string PaymentMethod { get; set; } = "";    
        public List<CartItemDto> Items { get; set; } = new();
    }
}
