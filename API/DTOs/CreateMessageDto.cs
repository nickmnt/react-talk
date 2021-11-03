using System;

namespace API.DTOs
{
    public class CreateMessageDto
    {
        public Guid ChatId { get; set; }
        public string Body { get; set; }
    }
}