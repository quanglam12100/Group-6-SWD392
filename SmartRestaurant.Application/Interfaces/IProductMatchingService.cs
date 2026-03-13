
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Interfaces
{
    public interface IProductMatchingService
    {
        Task<List<VoiceOrderItemDto>> ParseOrderFromVoiceAsync(string voiceText);
    }
}
