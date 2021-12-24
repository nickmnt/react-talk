﻿using System.Collections.Generic;
using Application.Messages;

namespace Application.Chats
{
    public class ChannelDetailsDto
    {
        public string Description { get; set; }
        public int MemberCount { get; set; }
        public ICollection<MessageDto> Messages { get; set; } = new List<MessageDto>();
    }
}