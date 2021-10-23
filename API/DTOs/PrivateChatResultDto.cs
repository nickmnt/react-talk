using System;
using Application.Messages;

namespace API.DTOs
{
    public class PrivateChatResultDto
    {
        public Guid ChatId { get; set; }
        public MessageDto Message { get; set; }
    }
}