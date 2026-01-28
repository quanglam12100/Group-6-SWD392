using Microsoft.AspNetCore.SignalR;

namespace SmartRestaurant.Realtime;

/// <summary>
/// WebSocket/SignalR hub for realtime kitchen & payment updates.
/// Events:
/// - "new_order": when a new order detail is created (pending).
/// - "order_ready": when an order detail is marked as ready.
/// - "order_status_changed": any status change for an order detail.
/// </summary>
public class OrderHub : Hub
{
}

