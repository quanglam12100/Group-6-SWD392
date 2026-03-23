using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartRestaurant.Application.Interfaces;
using SmartRestaurant.Application.Services;
using SmartRestaurant.Infrastructure.Data;
using SmartRestaurant.Infrastructure.Repository;
using SmartRestaurant.Infrastructure.Services;
using SmartRestaurant.Realtime;
using System.Text;

namespace SmartRestaurant
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ================= Controllers =================
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler =
                        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            // ================= DB Context =================
            builder.Services.AddDbContext<SmartRestaurantDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                )
            );

            // ================= SignalR (Từ HEAD - Cần cho Realtime) =================
            builder.Services.AddSignalR();

            // ================= CORS (Từ Vhuy - Cần để Frontend gọi được) =================
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // ================= JWT Authentication =================
            var jwtKey = builder.Configuration["Jwt:Key"]
                ?? throw new Exception("JWT Key missing");

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtKey))
                    };
                });

            // ================= Authorization (Từ Vhuy - Bắt buộc) =================
            builder.Services.AddAuthorization();

            // ================= Swagger =================
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "SmartRestaurant API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter: Bearer {token}"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            // ================= DI (Dependency Injection) =================
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IProductVariantRepository, ProductVariantRepository>();
            builder.Services.AddScoped<IAudioService, SmartRestaurant.Infrastructure.Services.OpenAiService>();
            builder.Services.AddScoped<IProductMatchingService, ProductMatchingService>();
            //builder.Services.AddScoped<ITableRepository, TableRepository>();
            builder.Services.AddScoped<ITableService, TableService>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IAccountService, AccountService>();

            var app = builder.Build();

            // ================= Middleware Pipeline =================
            
            // Swagger luôn bật để dễ test (bạn có thể bọc trong if (app.Environment.IsDevelopment()) nếu muốn)
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseStaticFiles();

            // UseCors phải đặt giữa UseRouting và UseAuthorization
            app.UseCors("AllowAll"); 

            // Auth Middleware (QUAN TRỌNG: Authentication trước Authorization)
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<OrderHub>("/hubs/orders");
            });

            app.Run();
        }
    }
}