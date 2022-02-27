using System;
using System.Collections.Generic;
using Application.Messages;
using Domain.Direct;

namespace Application.Chats.PrivateChats
{
    public class PrivateChatDto
    {
        public DateTime MyLastSeen { get; set; }
        public DateTime OtherLastSeen { get; set; }
        public string OtherUserId { get; set; }
        public string OtherUsername { get; set; }
    }
}