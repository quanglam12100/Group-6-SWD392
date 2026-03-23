using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.DTOs
{
    public class KitchenStatsDto
    {
        public int TotalPending { get; set; }
        public int TotalCooking { get; set; }
        public int TotalReady { get; set; }
        public int TotalServedToday { get; set; }
        public int TotalCancelledToday { get; set; }
        public double AveragePrepTimeMinutes { get; set; }
        public string? LongestWaitingTableName { get; set; }
    }
}
