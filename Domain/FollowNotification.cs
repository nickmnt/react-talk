using System;

namespace Domain
{
    public class FollowNotification
    {
        public int Id { get; set; }
        public AppUser Follower { get; set; }
        public DateTime CreatedAt { get; set; } 
    }
}