using System;

namespace Application.Messages
{
    public class MessageDto
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}