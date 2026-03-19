using SmartRestaurant.Application.Interfaces;
using Microsoft.Extensions.Configuration; // Thêm thư viện này để đọc appsettings.json
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartRestaurant.Infrastructure.Services
{

    public class OpenAiService : IAudioService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;


        public OpenAiService(IConfiguration configuration)
        {

            _apiKey = configuration["Groq:ApiKey"] ?? throw new Exception("Thiếu API Key của Groq!");

            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
        {
            if (audioStream == null || audioStream.Length == 0)
                throw new ArgumentException("Audio stream is empty");

            var apiUrl = "https://api.groq.com/openai/v1/audio/transcriptions";

            using var requestContent = new MultipartFormDataContent();
            var fileContent = new StreamContent(audioStream);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
            requestContent.Add(fileContent, "file", fileName);


            requestContent.Add(new StringContent("whisper-large-v3"), "model");

            try
            {
                var response = await _httpClient.PostAsync(apiUrl, requestContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Groq API Error: {responseString}");
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
                throw new Exception("Lỗi khi gọi Groq API: " + ex.Message);
            }
        }
    }
}