using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class UpdateTableStatusDto
    {
        public string Status { get; set; } = "";
        // Chỉ nhận: "available" | "occupied" | "reserved"
    }
}
