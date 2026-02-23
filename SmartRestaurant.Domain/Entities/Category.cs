using System.ComponentModel.DataAnnotations;

namespace SmartRestaurant.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên category là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên không được vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
