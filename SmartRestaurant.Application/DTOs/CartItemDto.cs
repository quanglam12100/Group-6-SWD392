namespace SmartRestaurant.Application.DTOs
{
    public class CartItemDto
    {
        public int ProductVariantId { get; set; } 
        public int Quantity { get; set; }

        
        public string? VoiceNote { get; set; } 
        public string? OriginalVoiceText { get; set; } 

        
        public List<int> ToppingIds { get; set; } = new();
    }
}