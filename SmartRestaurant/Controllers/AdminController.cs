using Microsoft.AspNetCore.Mvc;
using SmartRestaurant.Application.Interfaces;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")] 
    [ApiController]             
    public class AdminController : ControllerBase 
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        
        [HttpGet("kitchen-stats")]
        public async Task<IActionResult> GetKitchenStats([FromQuery] DateTime? date) 
        {
            try
            {
               
                var stats = await _unitOfWork.Orders.GetKitchenStatsAsync(date);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}