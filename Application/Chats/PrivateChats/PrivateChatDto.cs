using System.Collections.Generic;
using Application.Messages;
using Domain.Direct;

namespace Application.Chats.PrivateChats
{
    public class PrivateChatDto
    {
        public ICollection<MessageDto> Messages { get; set; } = new List<MessageDto>();
    }
}