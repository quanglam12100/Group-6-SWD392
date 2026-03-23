using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class TableResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Status { get; set; } = "";
        // available | occupied | reserved
        public OrderSummaryDto? CurrentOrder { get; set; }


        public int? CurrentStaffId { get; set; }
        public string? CurrentStaffName { get; set; }

    }
}
