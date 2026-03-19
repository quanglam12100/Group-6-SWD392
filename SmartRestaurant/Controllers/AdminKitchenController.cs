using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;

namespace SmartRestaurant.Controllers;

[ApiController]
[Route("api/admin/kitchen")]
[Authorize(Roles = "admin")]
public class AdminKitchenController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AdminKitchenController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _accountService.GetAccountsByRoleAsync("kitchen");
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _accountService.GetAccountByIdAsync(id);
        if (result == null || result.Role != "kitchen")
            return NotFound("Kitchen staff not found");

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAccountDto dto)
    {
        dto.Role = "kitchen"; // Ensure role is kitchen
        var result = await _accountService.CreateAccountAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAccountDto dto)
    {
        var existing = await _accountService.GetAccountByIdAsync(id);
        if (existing == null || existing.Role != "kitchen")
            return NotFound("Kitchen staff not found");

        var result = await _accountService.UpdateAccountAsync(id, dto);
        return result ? Ok("Updated successfully") : BadRequest("Update failed");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _accountService.GetAccountByIdAsync(id);
        if (existing == null || existing.Role != "kitchen")
            return NotFound("Kitchen staff not found");

        var result = await _accountService.DeleteAccountAsync(id);
        return result ? Ok("Deleted successfully") : BadRequest("Delete failed");
    }
}
