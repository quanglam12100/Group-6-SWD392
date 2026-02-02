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
                // Gọi thuật toán tìm kiếm
                var result = await _productMatchingService.FindProductByVoiceTextAsync(request.Text);

                if (result == null)
                {
                    return NotFound(new { Message = "Không tìm thấy món nào khớp với yêu cầu." });
                }

                // Trả về kết quả món tìm được
                return Ok(new
                {
                    Message = "Đã tìm thấy món!",
                    ProductVariantId = result.Id,
                    ProductName = result.Product?.Name, // Cần Include Product trong Repo mới hiện tên
                    Size = result.SizeName,
                    Price = result.Price ?? 0,
                    MatchScore = "High" // (Bạn có thể return score từ service nếu muốn)
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
                // 1. Chuyển file upload thành Stream
                using var stream = file.OpenReadStream();

                // 2. Gọi AI convert Audio -> Text (Integration)
                // (Bạn cần Inject IAudioService vào Controller trước)
                var textResult = await _audioService.TranscribeAudioAsync(stream, file.FileName);

                // 3. Gọi thuật toán tìm món (Algorithm - Đã làm)
                var productMatch = await _productMatchingService.FindProductByVoiceTextAsync(textResult);

                if (productMatch == null)
                    return NotFound(new { VoiceText = textResult, Message = "Không tìm thấy món." });

                return Ok(new
                {
                    VoiceText = textResult,
                    Product = new
                    {
                        productMatch.Id,
                        productMatch.Product?.Name,
                        productMatch.Price
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
