using System;
using Domain.Direct;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class CreateMessageDto
    {
        public Guid ChatId { get; set; }
        public string Body { get; set; }
        public int ReplyToMessageId { get; set; }
    }
}