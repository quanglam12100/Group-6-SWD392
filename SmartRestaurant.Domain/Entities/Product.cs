using System.ComponentModel.DataAnnotations;

namespace SmartRestaurant.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên không được vượt quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự")]
        public string Description { get; set; } = string.Empty;
        
        [Url(ErrorMessage = "URL hình ảnh không hợp lệ")]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "CategoryId là bắt buộc")]
        public int CategoryId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Category Category { get; set; } = null!;
        public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
    }
}
