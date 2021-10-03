using System;

namespace Application.Notifications
{
    public class FollowNotifDto
    {
        public string Username { get; set; }
        public string Image { get; set; }
        public bool Following { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}