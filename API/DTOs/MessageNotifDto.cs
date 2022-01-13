using System;
using Application.Messages;

namespace API.DTOs
{
    public class MessageNotifDto
    {
        public MessageDto Message { get; set; }
        public Guid ChatId { get; set; }
        public int NotSeenCount { get; set; }
    }
}