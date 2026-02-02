using SmartRestaurant.Application.Common;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartRestaurant.Application.Services
{
    public class ProductMatchingService : IProductMatchingService
    {
        private readonly IProductVariantRepository _productVariantRepository;

        public ProductMatchingService(IProductVariantRepository productVariantRepository)
        {
            _productVariantRepository = productVariantRepository;
        }

        public async Task<ProductVariant?> FindProductByVoiceTextAsync(string voiceText)
        {
            if (string.IsNullOrEmpty(voiceText)) return null;

            var normalizedVoice = StringUtils.RemoveDiacritics(voiceText);

            // GỌI REPOSITORY ĐỂ LẤY DATA
            var allVariants = await _productVariantRepository.GetAllWithKeywordsAsync();

            ProductVariant? bestMatch = null;
            int maxScore = 0;

            // ... Phần logic chấm điểm ở dưới giữ nguyên y hệt ...
            foreach (var variant in allVariants)
            {
                int currentScore = 0;
                // Lưu ý: Có thể cần check null cho Product
                if (variant.Product == null) continue;

                string prodName = StringUtils.RemoveDiacritics(variant.Product.Name ?? "");
                string sizeName = StringUtils.RemoveDiacritics(variant.SizeName ?? "");

                if (normalizedVoice.Contains(prodName)) currentScore += 10;

                if (!string.IsNullOrEmpty(sizeName) && normalizedVoice.Contains(sizeName))
                    currentScore += 5;

                if (variant.Product.ProductKeywords != null)
                {
                    foreach (var kw in variant.Product.ProductKeywords)
                    {
                        var normalizedKw = StringUtils.RemoveDiacritics(kw.Keyword ?? "");
                        if (normalizedVoice.Contains(normalizedKw))
                        {
                            currentScore += 8;
                            break;
                        }
                    }
                }

                if (currentScore > maxScore)
                {
                    maxScore = currentScore;
                    bestMatch = variant;
                }
            }

            return maxScore > 0 ? bestMatch : null;
        }
    }
}
