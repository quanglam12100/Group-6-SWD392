using SmartRestaurant.Application.Common;
using SmartRestaurant.Application.DTOs;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Domain.Entities;
using System.Text.RegularExpressions;

namespace SmartRestaurant.Infrastructure.Services
{
    public class ProductMatchingService : IProductMatchingService
    {
        private readonly IProductVariantRepository _productVariantRepository;

        public ProductMatchingService(IProductVariantRepository productVariantRepository)
        {
            _productVariantRepository = productVariantRepository;
        }

        public async Task<List<VoiceOrderItemDto>> ParseOrderFromVoiceAsync(string voiceText)
        {
            var results = new List<VoiceOrderItemDto>();
            if (string.IsNullOrEmpty(voiceText)) return results;

            var parts = voiceText.ToLower().Split(new[] { " và ", ",", " với ", " thêm " }, StringSplitOptions.RemoveEmptyEntries);

            var allVariants = await _productVariantRepository.GetAllWithKeywordsAsync();

            foreach (var part in parts)
            {
                int quantity = 1; 
                string rawText = part.Trim();

                var quantityMatch = Regex.Match(rawText, @"(\d+)\s*(ly|cốc|phần|bát)?");
                if (quantityMatch.Success && int.TryParse(quantityMatch.Groups[1].Value, out int qty))
                {
                    quantity = qty;
                }
                else if (rawText.Contains("một ")) quantity = 1;
                else if (rawText.Contains("hai ")) quantity = 2;
                else if (rawText.Contains("ba ")) quantity = 3;

                var textToMatch = Regex.Replace(rawText, @"(\d+)\s*(ly|cốc|phần|bát)?", "").Trim();
                textToMatch = textToMatch.Replace("một", "").Replace("hai", "").Replace("ba", "").Trim();

                var bestVariant = FindBestMatchVariant(textToMatch, allVariants);

                if (bestVariant != null)
                {
                    results.Add(new VoiceOrderItemDto
                    {
                        Quantity = quantity,
                        OriginalMatchText = rawText,
                        ProductVariantId = bestVariant.Id,
                        ProductName = bestVariant.Product?.Name,
                        SizeName = bestVariant.SizeName,
                        Price = bestVariant.Price ?? 0
                    });
                }
            }

            return results;
        }

        private ProductVariant? FindBestMatchVariant(string normalizedVoice, IEnumerable<ProductVariant> allVariants)
        {
            normalizedVoice = StringUtils.RemoveDiacritics(normalizedVoice);
            ProductVariant? bestMatch = null;
            int maxScore = 0;

            foreach (var variant in allVariants)
            {
                int currentScore = 0;
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