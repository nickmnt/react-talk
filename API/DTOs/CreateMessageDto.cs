using System;
using Domain.Direct;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class CreateMessageDto
    {
        public MessageType MessageType { get; set; }
        public Guid ChatId { get; set; }
        public string Body { get; set; }
        public IFormFile File { get; set; }
    }
}