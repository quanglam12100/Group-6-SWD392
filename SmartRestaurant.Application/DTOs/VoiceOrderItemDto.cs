
    namespace SmartRestaurant.Application.DTOs
{
    public class VoiceOrderItemDto
    {
        public int Quantity { get; set; }
        public string OriginalMatchText { get; set; } = string.Empty;

        public int ProductVariantId { get; set; }
        public string? ProductName { get; set; }
        public string? SizeName { get; set; }
        public decimal Price { get; set; }
    }
}
