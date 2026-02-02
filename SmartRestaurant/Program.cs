using Microsoft.EntityFrameworkCore;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Application.Services;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Infrastructure.Repository;

namespace SmartRestaurant
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddDbContext<SmartRestaurantDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                ));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IOrderService, OrderService>();

            builder.Services.AddScoped<IProductVariantRepository, ProductVariantRepository>();
            builder.Services.AddScoped<IAudioService, SmartRestaurant.Infrastructure.Services.OpenAiService>();



            builder.Services.AddScoped<IProductMatchingService, ProductMatchingService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
