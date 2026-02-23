using System.ComponentModel.DataAnnotations;

namespace SmartRestaurant.Domain.Entities
{
    public class Table
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên bàn là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên không được vượt quá 50 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        [StringLength(20)]
        public string Status { get; set; } = "available"; // available, occupied, reserved
        
        public int Capacity { get; set; } = 4; // Default capacity
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
