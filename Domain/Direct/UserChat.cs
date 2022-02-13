using System;
using System.Text.Json.Serialization;

namespace Domain.Direct
{
    public class UserChat
    {
        public Chat Chat { get; set; }
        public Guid ChatId { get; set; }
        public AppUser AppUser { get; set; }
        public MemberType MembershipType { get; set; }
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
        public string AppUserId { get; set; }
        public DateTime LastSeen { get; set; } = DateTime.UtcNow.AddDays(-1);
        // public GroupMemberPermissions MemberPermissions { get; set; }
        // [JsonIgnore] public int MemberPermissionsId { get; set; }
    }
}