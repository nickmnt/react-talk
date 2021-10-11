using System;

namespace Domain.Direct
{
    public class UserChat
    {
        public Chat Chat { get; set; }
        public Guid ChatId { get; set; }
        public AppUser AppUser { get; set; }
        public string AppUserId { get; set; }
    }
}