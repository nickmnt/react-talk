using System;

namespace Domain
{
    public class JoinNotification
    {
        public int Id { get; set; }
        public AppUser User { get; set; }
        public Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}