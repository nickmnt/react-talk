using System;
using System.Collections.Generic;
using Application.Messages;
using Domain.Direct;

namespace Application.Chats
{
    public class ChannelDetailsDto
    {
        public string Description { get; set; }
        public List<ChannelMember> Members { get; set; }
    }
}