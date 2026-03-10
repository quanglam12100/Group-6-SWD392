namespace SmartRestaurant.Application.Services
{
    public class OrderItemDto
    {
        public object ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}