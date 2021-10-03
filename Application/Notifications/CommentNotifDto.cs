using System;

namespace Application.Notifications
{
    public class CommentNotifDto
    {
        public string Username { get; set; }
        public string Image { get; set; }
        public string ActivityId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}