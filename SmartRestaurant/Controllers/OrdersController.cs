using Microsoft.AspNetCore.Mvc;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _orderService.CreateOrderAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


        [HttpPost("online")]
        public async Task<IActionResult> CreateOnlineOrder([FromBody] CreateOnlineOrderDto request)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var result = await _orderService.CreateOnlineOrderAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex) { return BadRequest(new { Error = ex.Message }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            try
            {
                var result = await _orderService.GetOrderByIdAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex) { return NotFound(new { Error = ex.Message }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }


        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            try
            {
                await _orderService.CancelOrderAsync(id);
                return Ok(new { Message = $"Đã hủy đơn hàng #{id}" });
            }
            catch (KeyNotFoundException ex) { return NotFound(new { Error = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { Error = ex.Message }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }

        [HttpPut("{id}/delivery-status")]
        public async Task<IActionResult> UpdateDeliveryStatus(int id, [FromBody] UpdateDeliveryStatusDto request)
        {
            try
            {
                await _orderService.UpdateDeliveryStatusAsync(id, request.DeliveryStatus);
                return Ok(new
                {
                    Message = $"Cập nhật trạng thái giao hàng thành '{request.DeliveryStatus}' thành công"
                });
            }
            catch (KeyNotFoundException ex) { return NotFound(new { Error = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { Error = ex.Message }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }

        // GET /api/orders
        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("staff/{staffId}")]
        public async Task<IActionResult> GetOrdersByStaffId(int staffId)
        {
            var orders = await _orderService.GetOrdersByStaffIdAsync(staffId);
            return Ok(orders);
        }
    }
}
