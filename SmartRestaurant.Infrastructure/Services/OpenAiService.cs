using SmartRestaurant.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Infrastructure.Services
{
    public class OpenAiService :IAudioService
    {
        private readonly string _apiKey = "SK-.....";
        public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
        {
            
            return "kết quả test";
        }

    }
}
