using System;
using System.Collections.Generic;
using Application.Messages;
using Domain.Direct;

namespace Application.Chats.PrivateChats
{
    public class PrivateChatDto
    {
        public ICollection<MessageDto> Messages { get; set; } = new List<MessageDto>();
        public DateTime MyLastSeen { get; set; }
        public DateTime OtherLastSeen { get; set; }
        public string OtherUserId { get; set; }
    }
}