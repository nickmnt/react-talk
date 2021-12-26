using System.Collections.Generic;
using Application.Messages;
using Domain.Direct;

namespace Application.Chats
{
    public class GroupDetailsDto
    {
        public string Description { get; set; }
        public List<GroupMember> Members { get; set; }
        public ICollection<MessageDto> Messages { get; set; } = new List<MessageDto>();
    }
}