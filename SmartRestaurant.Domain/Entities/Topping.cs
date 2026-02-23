using System.ComponentModel.DataAnnotations;

namespace SmartRestaurant.Domain.Entities
{
    public class Topping
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên topping là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên không được vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
        public decimal Price { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
