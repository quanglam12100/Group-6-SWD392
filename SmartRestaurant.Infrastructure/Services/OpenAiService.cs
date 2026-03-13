using SmartRestaurant.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartRestaurant.Infrastructure.Services
{
    public class OpenAiService :IAudioService
    {
        
        private readonly string _apiKey = "";
        private readonly HttpClient _httpClient;
        public OpenAiService()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }
        public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
        {

            if (audioStream == null || audioStream.Length == 0)
                throw new ArgumentException("Audio stream is empty");

            // URL API của OpenAI dành cho Audio -> Text
            var apiUrl = "https://api.openai.com/v1/audio/transcriptions";

            using var requestContent = new MultipartFormDataContent();
            var fileContent = new StreamContent(audioStream);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
            requestContent.Add(fileContent, "file", fileName);

            requestContent.Add(new StringContent("whisper-1"), "model");

            try
            {
                var response = await _httpClient.PostAsync(apiUrl, requestContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"OpenAI API Error: {responseString}");
                }

                using var jsonDoc = JsonDocument.Parse(responseString);
                if (jsonDoc.RootElement.TryGetProperty("text", out var textElement))
                {
                    return textElement.GetString() ?? "";
                }

                return "";
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi gọi OpenAI: " + ex.Message);
            }
        }

    }
}
