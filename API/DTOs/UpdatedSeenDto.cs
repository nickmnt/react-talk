using System;

namespace API.DTOs
{
    public class UpdatedSeenDto
    {
        public Guid ChatId { get; set; }
        public string Username { get; set; }
        public DateTime LastSeen { get; set; }
    }
}