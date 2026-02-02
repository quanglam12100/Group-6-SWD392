using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CreateOrderAsync(CreateOrderDto request)
        {
            // 1. Chuẩn bị dữ liệu Order (Cha)
            var order = new Order
            {
                TableId = request.TableId,
                StaffId = request.StaffId,
                CustomerId = request.CustomerId,
                OrderCode = $"ORD-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}", // Mã đơn ngẫu nhiên
                CreatedAt = DateTime.Now,
                PaymentStatus = "unpaid",
                TotalAmount = 0, // Sẽ cộng dồn ở dưới
                OrderDetails = new List<OrderDetail>()
            };

            // 2. Lấy danh sách ID các món và topping từ request để query DB 1 lần cho nhanh
            // (Lấy hết ProductVariant cần dùng)
            var allVariantIds = request.Items.Select(x => x.ProductVariantId).Distinct().ToList();
            var variants = await _unitOfWork.ProductVariants.GetByIdsAsync(allVariantIds);

            // (Lấy hết Topping cần dùng)
            var allToppingIds = request.Items.SelectMany(x => x.ToppingIds).Distinct().ToList();
            var toppings = await _unitOfWork.Toppings.GetByIdsAsync(allToppingIds);

            // 3. Duyệt qua từng món khách chọn để tính tiền và tạo Detail
            foreach (var itemDto in request.Items)
            {
                // Tìm thông tin món trong list đã lấy từ DB
                var variantEntity = variants.FirstOrDefault(v => v.Id == itemDto.ProductVariantId);
                if (variantEntity == null) continue; // Nếu ko tìm thấy món thì bỏ qua (hoặc throw lỗi tùy bạn)

                // Tạo OrderDetail
                var orderDetail = new OrderDetail
                {
                    ProductVariantId = itemDto.ProductVariantId,
                    Quantity = itemDto.Quantity,
                    VoiceNote = itemDto.VoiceNote, // Lưu ghi chú (ít đá, nhiều đường...)
                    OriginalVoiceText = itemDto.OriginalVoiceText,
                    Status = "pending",
                    OrderedAt = DateTime.Now,
                    OrderDetailToppings = new List<OrderDetailTopping>()
                };

                // Tính tiền cơ bản: Giá món * Số lượng
                decimal currentItemTotal = (variantEntity.Price ?? 0) * itemDto.Quantity;

                // 4. Xử lý Topping (nếu có)
                if (itemDto.ToppingIds != null && itemDto.ToppingIds.Any())
                {
                    foreach (var toppingId in itemDto.ToppingIds)
                    {
                        var toppingEntity = toppings.FirstOrDefault(t => t.Id == toppingId);
                        if (toppingEntity != null)
                        {
                            // Tạo liên kết Món - Topping
                            orderDetail.OrderDetailToppings.Add(new OrderDetailTopping
                            {
                                ToppingId = toppingId,
                                PriceAtPurchase = toppingEntity.Price // Lưu giá topping tại thời điểm mua
                            });

                            // Cộng tiền topping: Giá topping * Số lượng món cha
                            // (Ví dụ: 2 ly trà sữa thì topping cũng phải tính tiền x2)
                            currentItemTotal += (toppingEntity.Price ?? 0) * itemDto.Quantity;
                        }
                    }
                }

                
                order.TotalAmount += currentItemTotal;

                
                order.OrderDetails.Add(orderDetail);
            }

            // 5. Lưu xuống DB
            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CommitAsync();

            return order.Id;
        }
    }
}
