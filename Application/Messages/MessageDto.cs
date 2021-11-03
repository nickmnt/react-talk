using System;
using Domain.Direct;

namespace Application.Messages
{
    public class MessageDto
    {
        public MessageType Type { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string Body { get; set; }
        public string PublicId { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}