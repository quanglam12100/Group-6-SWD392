using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;

namespace SmartRestaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

       
        public async Task<CreateOrderResponseDto> CreateOrderAsync(CreateOrderDto request)
        {
            if (request.Items == null || !request.Items.Any())
                throw new ArgumentException("Đơn hàng phải có ít nhất 1 món");

            var order = new Order
            {
                TableId = request.TableId,
                StaffId = request.StaffId,
                CustomerId = request.CustomerId,
                OrderType = "dine_in",
                OrderCode = GenerateOrderCode(),
                CreatedAt = DateTime.Now,
                PaymentStatus = "unpaid",
                TotalAmount = 0,
                OrderDetails = new List<OrderDetail>()
            };

            return await BuildOrderAndSave(order, request.Items);
        }

        
        public async Task<CreateOrderResponseDto> CreateOnlineOrderAsync(CreateOnlineOrderDto request)
        {
            if (string.IsNullOrWhiteSpace(request.CustomerName))
                throw new ArgumentException("Vui lòng nhập tên khách hàng");

            if (string.IsNullOrWhiteSpace(request.CustomerPhone))
                throw new ArgumentException("Vui lòng nhập số điện thoại");

            if (string.IsNullOrWhiteSpace(request.DeliveryAddress))
                throw new ArgumentException("Vui lòng nhập địa chỉ giao hàng");

            if (request.Items == null || !request.Items.Any())
                throw new ArgumentException("Đơn hàng phải có ít nhất 1 món");

            var order = new Order
            {
                TableId = null,
                StaffId = null,
                CustomerId = null,
                OrderType = "online",
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                DeliveryAddress = request.DeliveryAddress,
                DeliveryStatus = "waiting",
                PaymentMethod = request.PaymentMethod,
                OrderCode = GenerateOrderCode(),
                CreatedAt = DateTime.Now,
                PaymentStatus = "unpaid",
                TotalAmount = 0,
                OrderDetails = new List<OrderDetail>()
            };

            return await BuildOrderAndSave(order, request.Items);
        }

      
        public async Task<OrderDetailResponseDto> GetOrderByIdAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);

            if (order == null)
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng #{id}");

            var billItems = order.OrderDetails.Select(detail => new BillItemDto
            {
                OrderDetailId = detail.Id,
                ProductName = detail.ProductVariant?.Product?.Name ?? "",
                VariantName = detail.ProductVariant?.SizeName ?? "",
                Quantity = detail.Quantity ?? 0,
                UnitPrice = detail.ProductVariant?.Price ?? 0,
                Status = detail.Status,
                VoiceNote = detail.VoiceNote,
                Toppings = detail.OrderDetailToppings.Select(t => new BillToppingDto
                {
                    ToppingId = t.ToppingId ?? 0,
                    ToppingName = t.Topping?.Name ?? "",
                    Price = t.PriceAtPurchase ?? 0
                }).ToList()
            }).ToList();

            return new OrderDetailResponseDto
            {
                OrderId = order.Id,
                OrderCode = order.OrderCode ?? "",
                OrderType = order.OrderType ?? "dine_in",
                TableName = order.Table?.Name,
                StaffName = order.Staff?.Fullname,
                CreatedAt = order.CreatedAt ?? DateTime.Now,
                ClosedAt = order.ClosedAt,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                DeliveryAddress = order.DeliveryAddress,
                DeliveryStatus = order.DeliveryStatus,
                Items = billItems,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus
            };
        }

        private decimal CalculateTotal(Order order)
        {
            return order.OrderDetails
                .Where(d => d.Status != "cancelled")
                .Sum(d =>
                {
                    decimal unitPrice = d.ProductVariant?.Price ?? 0;
                    decimal toppingTotal = d.OrderDetailToppings.Sum(t => t.PriceAtPurchase ?? 0) * (d.Quantity ?? 0);
                    return (unitPrice * (d.Quantity ?? 0)) + toppingTotal;
                });
        }

       
        private async Task<CreateOrderResponseDto> BuildOrderAndSave(Order order, List<CartItemDto> items)
        {
            // Query DB 1 lần
            var allVariantIds = items.Select(x => x.ProductVariantId).Distinct().ToList();
            var variants = await _unitOfWork.ProductVariants.GetByIdsAsync(allVariantIds);

            var allToppingIds = items.SelectMany(x => x.ToppingIds).Distinct().ToList();
            var toppings = allToppingIds.Any()
                ? await _unitOfWork.Toppings.GetByIdsAsync(allToppingIds)
                : new List<Topping>();

            var billItems = new List<BillItemDto>();

            foreach (var itemDto in items)
            {
                var variantEntity = variants.FirstOrDefault(v => v.Id == itemDto.ProductVariantId);
                if (variantEntity == null)
                    throw new Exception($"Sản phẩm ID {itemDto.ProductVariantId} không tồn tại");

                var orderDetail = new OrderDetail
                {
                    ProductVariantId = itemDto.ProductVariantId,
                    Quantity = itemDto.Quantity,
                    VoiceNote = itemDto.VoiceNote,
                    OriginalVoiceText = itemDto.OriginalVoiceText,
                    Status = "pending",
                    OrderedAt = DateTime.Now,
                    OrderDetailToppings = new List<OrderDetailTopping>()
                };

                decimal unitPrice = variantEntity.Price ?? 0;
                decimal currentItemTotal = unitPrice * itemDto.Quantity;

                var billItem = new BillItemDto
                {
                    ProductName = variantEntity.Product?.Name ?? "",
                    VariantName = variantEntity.SizeName ?? "",
                    Quantity = itemDto.Quantity,
                    UnitPrice = unitPrice,
                    VoiceNote = itemDto.VoiceNote,
                    Toppings = new List<BillToppingDto>()
                };

                // Xử lý topping
                if (itemDto.ToppingIds != null && itemDto.ToppingIds.Any())
                {
                    foreach (var toppingId in itemDto.ToppingIds)
                    {
                        var toppingEntity = toppings.FirstOrDefault(t => t.Id == toppingId);
                        if (toppingEntity != null)
                        {
                            orderDetail.OrderDetailToppings.Add(new OrderDetailTopping
                            {
                                ToppingId = toppingId,
                                PriceAtPurchase = toppingEntity.Price
                            });

                            currentItemTotal += (toppingEntity.Price ?? 0) * itemDto.Quantity;

                            billItem.Toppings.Add(new BillToppingDto
                            {
                                ToppingId = toppingId,
                                ToppingName = toppingEntity.Name ?? "",
                                Price = toppingEntity.Price ?? 0
                            });
                        }
                    }
                }

                order.TotalAmount += currentItemTotal;
                order.OrderDetails.Add(orderDetail);
                billItems.Add(billItem);
            }

            // Lưu DB
            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CommitAsync();

            // Gán OrderDetailId sau khi lưu
            for (int i = 0; i < billItems.Count; i++)
                billItems[i].OrderDetailId = order.OrderDetails.ElementAt(i).Id;

            return new CreateOrderResponseDto
            {
                OrderId = order.Id,
                OrderCode = order.OrderCode!,
                OrderType = order.OrderType,
                TableName = order.Table?.Name,
                StaffName = order.Staff?.Fullname,
                CreatedAt = order.CreatedAt ?? DateTime.Now,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                DeliveryAddress = order.DeliveryAddress,
                DeliveryStatus = order.DeliveryStatus,
                Items = billItems,
                PaymentStatus = order.PaymentStatus
            };
        }

        private static string GenerateOrderCode() =>
            $"ORD-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";

        public async  Task CancelOrderAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);

            if (order == null)
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng #{id}");

          
            if (order.PaymentStatus == "paid")
                throw new InvalidOperationException("Không thể hủy đơn đã thanh toán");

            
            if (order.OrderType == "online" && order.DeliveryStatus != "waiting")
                throw new InvalidOperationException($"Không thể hủy đơn đang ở trạng thái '{order.DeliveryStatus}'");

           
            foreach (var detail in order.OrderDetails)
                detail.Status = "cancelled";

            order.PaymentStatus = "refunded";
            order.ClosedAt = DateTime.Now;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CommitAsync();
        }

        public async  Task UpdateDeliveryStatusAsync(int id, string deliveryStatus)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);

            if (order == null)
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng #{id}");

            if (order.OrderType != "online")
                throw new InvalidOperationException("Chỉ đơn online mới có trạng thái giao hàng");

            // Kiểm tra thứ tự trạng thái hợp lệ
            var validTransitions = new Dictionary<string, string>
            {
                { "waiting",    "confirmed"  },
                { "confirmed",  "delivering" },
                { "delivering", "delivered"  }
            };

            if (!validTransitions.TryGetValue(order.DeliveryStatus ?? "", out var expectedNext))
                throw new InvalidOperationException($"Đơn hàng đã ở trạng thái cuối: '{order.DeliveryStatus}'");

            if (deliveryStatus != expectedNext)
                throw new InvalidOperationException(
                    $"Trạng thái không hợp lệ. Hiện tại: '{order.DeliveryStatus}' → Tiếp theo phải là: '{expectedNext}'");

            order.DeliveryStatus = deliveryStatus;

           
            if (deliveryStatus == "delivered")
                order.ClosedAt = DateTime.Now;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CommitAsync();
        }

        public async Task<List<OrderSummaryDto>> GetAllOrdersAsync()
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();

            return orders.Select(o =>
            {
                return new OrderSummaryDto
                {
                    OrderId = o.Id,
                    OrderCode = o.OrderCode ?? "",
                    OrderType = o.OrderType ?? "dine_in",
                    TableName = o.Table?.Name,
                    StaffName = o.Staff?.Fullname,
                    CustomerName = o.CustomerName,
                    CustomerPhone = o.CustomerPhone,
                    DeliveryStatus = o.DeliveryStatus,
                    TotalAmount = CalculateTotal(o),
                    PaymentStatus = o.PaymentStatus,
                    CreatedAt = o.CreatedAt,
                    TotalItems = o.OrderDetails.Where(d => d.Status != "cancelled").Sum(d => d.Quantity ?? 0)
                };
            }).ToList();
        }
    }
}