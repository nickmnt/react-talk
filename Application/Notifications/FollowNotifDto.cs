using System;

namespace Application.Notifications
{
    public class FollowNotifDto
    {
        public string FollowerUsername { get; set; }
        public string FollowerImage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}