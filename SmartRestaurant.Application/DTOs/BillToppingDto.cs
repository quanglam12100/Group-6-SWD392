using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    
    public class BillToppingDto
    {
        public int ToppingId { get; set; }
        public string ToppingName { get; set; } = "";
        public decimal Price { get; set; }
    }
}
