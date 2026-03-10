namespace SmartRestaurant.Application.Services
{
    public class OrderItemDto
    {
        public object ProductName { get; set; }
        public int Quantity { get; set; }
        public int? Price { get; set; }
    }
}