using System;
using System.Text.Json.Serialization;

namespace Domain.Direct
{
    public class GroupMember
    {
        public int MemberType { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public DateTime LastSeen { get; set; }
        // Member permissions
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
        public string AppUserId { get; set; }
        [JsonIgnore] public Guid ChatId { get; set; }
    }
}