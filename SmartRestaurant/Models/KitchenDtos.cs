using System;
using System.Collections.Generic; // Nhớ dòng này để dùng List

namespace SmartRestaurant.Models
{
    // 1. Request tạo món (Gửi từ App nhân viên lên)
    public class CreateOrderDetailRequest
    {
        public int OrderId { get; set; } // ID bill đang mở
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; } = 1;

        // --- BỔ SUNG ---
        public string? VoiceNote { get; set; } // Ghi chú (VD: "Ít đường, nhiều đá")
        public List<int> ToppingIds { get; set; } = new List<int>(); // Danh sách ID các topping khách chọn
    }

    // 2. Request cập nhật trạng thái (Bếp bấm)
    public class UpdateOrderDetailStatusRequest
    {
        // VD: "cooking", "ready", "cancelled"
        public string Status { get; set; } = string.Empty;
    }

    // 3. Response hiển thị lên màn hình Bếp (Quan trọng nhất)
    public class KitchenOrderItemResponse
    {
        public int Id { get; set; } // OrderDetailId
        public string? OrderCode { get; set; }
        public int? TableId { get; set; }
        public string? TableName { get; set; }
        public string? ProductName { get; set; }
        public string? SizeName { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? OrderedAt { get; set; }

        // --- BỔ SUNG QUAN TRỌNG ---
        public string? VoiceNote { get; set; } // Để bếp đọc: "Khách dị ứng hành"

        // Danh sách topping đi kèm món này
        public List<KitchenToppingResponse> Toppings { get; set; } = new List<KitchenToppingResponse>();
    }

    // 4. Class con để chứa thông tin Topping (Dùng cho KitchenOrderItemResponse)
    public class KitchenToppingResponse
    {
        public string Name { get; set; } = string.Empty; // Tên topping (VD: Trân châu)
        public int Quantity { get; set; } = 1;
    }
}