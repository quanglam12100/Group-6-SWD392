using Microsoft.AspNetCore.Mvc;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;

namespace SmartRestaurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoiceController : ControllerBase
    {
        private readonly IProductMatchingService _productMatchingService;
        private readonly IAudioService _audioService;

        public VoiceController(IProductMatchingService productMatchingService, IAudioService audioService)
        {
            _productMatchingService = productMatchingService;
            _audioService = audioService;
        }

        [HttpPost("match-product")]
        public async Task<IActionResult> MatchProduct([FromBody] VoiceCommandDto request)
        {
            try
            {
                // Gọi hàm mới (trả về List)
                var results = await _productMatchingService.ParseOrderFromVoiceAsync(request.Text);

                if (results == null || !results.Any())
                {
                    return NotFound(new { Message = "Không tìm thấy món nào khớp với yêu cầu." });
                }

                return Ok(new
                {
                    Message = "Đã phân tích xong order!",
                    Items = results 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("upload-audio")]
        public async Task<IActionResult> UploadAudio(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng upload file âm thanh.");

            try
            {
                using var stream = file.OpenReadStream();
                var textResult = await _audioService.TranscribeAudioAsync(stream, file.FileName);

                // Gọi hàm mới 
                var orderItems = await _productMatchingService.ParseOrderFromVoiceAsync(textResult);

                if (orderItems == null || !orderItems.Any())
                    return NotFound(new { VoiceText = textResult, Message = "Không nhận diện được món nào trong câu." });

                return Ok(new
                {
                    VoiceText = textResult,
                    Items = orderItems 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}