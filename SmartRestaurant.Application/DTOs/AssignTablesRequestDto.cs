using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class AssignTablesRequestDto
    {
        public int StaffId { get; set; }
        public List<int> TableIds { get; set; } = new List<int>();
    }
}
