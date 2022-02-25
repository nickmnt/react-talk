using System.Collections.Generic;
using Application.Messages;
using Domain;
using Domain.Direct;

namespace Application.Chats
{
    public class GroupDetailsDto
    {
        public string Description { get; set; }
        public List<GroupMember> Members { get; set; }
        // Member Permissions (For All)
        public bool SendMessagesAll { get; set; } = true;
        public bool SendMediaAll { get; set; } = true;
        public bool AddUsersAll { get; set; } = true;
        public bool PinMessagesAll { get; set; } = true;
        public bool ChangeChatInfoAll { get; set; } = true;
        // Member Permissions (For requesting user)
        public bool SendMessages { get; set; } = true;
        public bool SendMedia { get; set; } = true;
        public bool AddUsers { get; set; } = true;
        public bool PinMessages { get; set; } = true;
        public bool ChangeChatInfo { get; set; } = true;
        // Admin permissions
        public bool DeleteMessages { get; set; } = true;
        public bool BanUsers { get; set; }  = true;
        public bool AddNewAdmins { get; set; } = true;
        public bool RemainAnonymous { get; set; } = true;
        public string CustomTitle { get; set; }
        public ICollection<MessageDto> Messages { get; set; } = new List<MessageDto>();
    }
}