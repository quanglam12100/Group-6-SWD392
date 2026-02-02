namespace SmartRestaurant.Application.DTOs
{
    public class RegisterRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Fullname { get; set; } = null!;

        public string? Role { get; set; }
    }
}
