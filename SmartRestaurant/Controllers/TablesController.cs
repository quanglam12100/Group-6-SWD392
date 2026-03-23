using Microsoft.AspNetCore.Mvc;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TablesController(ITableService tableService)
        {
            _tableService = tableService;
        }

        // GET /api/tables
        [HttpGet("GetAllTable")]
        public async Task<IActionResult> GetAllTables()
        {
            var tables = await _tableService.GetAllTablesAsync();
            return Ok(tables);
        }

        // PUT /api/tables/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTableStatusDto request)
        {
            try
            {
                await _tableService.UpdateTableStatusAsync(id, request.Status);
                return Ok(new { Message = $"Đã cập nhật bàn #{id} sang trạng thái '{request.Status}'" });
            }
            catch (ArgumentException ex) { return BadRequest(new { Error = ex.Message }); }
            catch (KeyNotFoundException ex) { return NotFound(new { Error = ex.Message }); }
            catch (Exception ex) { return BadRequest(new { Error = ex.Message }); }
        }



        

        // POST: /api/tables/assign-tables
        [HttpPost("assign-tables")]
        public async Task<IActionResult> AssignTables([FromBody] AssignTablesRequestDto request)
        {
            try
            {
                await _tableService.AssignTablesToStaffAsync(request);
                return Ok(new { success = true, message = "Phân công bàn cho nhân viên thành công." });
            }
            catch (ArgumentException ex) { return BadRequest(new { success = false, message = ex.Message }); }
            catch (KeyNotFoundException ex) { return NotFound(new { success = false, message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = ex.Message }); }
        }

        // POST: /api/tables/clear-tables
        [HttpPost("clear-tables")]
        public async Task<IActionResult> ClearTables([FromBody] List<int> tableIds)
        {
            try
            {
                await _tableService.ClearTablesAsync(tableIds);
                return Ok(new { success = true, message = "Đã giải phóng các bàn được chọn." });
            }
            catch (ArgumentException ex) { return BadRequest(new { success = false, message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = ex.Message }); }
        }
    }
}
