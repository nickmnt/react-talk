using System;

namespace Application.Notifications
{
    public class JoinNotifDto
    {
        public string Username { get; set; }
        public string Image { get; set; }
        public string ActivityId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}