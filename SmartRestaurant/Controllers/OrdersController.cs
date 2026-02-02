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
                var orderId = await _orderService.CreateOrderAsync(request);
                return Ok(new
                {
                    Message = "Tạo đơn hàng thành công",
                    OrderId = orderId
                });
            }
            catch (Exception ex)
            {
                
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
