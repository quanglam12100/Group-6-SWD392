using System.ComponentModel.DataAnnotations;

namespace SmartRestaurant.Domain.Entities
{
    public class ProductVariant
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "ProductId là bắt buộc")]
        public int ProductId { get; set; }
        
        [Required(ErrorMessage = "Tên size là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên size không được vượt quá 50 ký tự")]
        public string SizeName { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
        public decimal Price { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public Product Product { get; set; } = null!;
    }
}
