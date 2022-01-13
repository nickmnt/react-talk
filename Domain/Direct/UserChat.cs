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
        public string AppUserId { get; set; }
        public DateTime LastSeen { get; set; } = DateTime.UtcNow.AddDays(-1);
        // public GroupMemberPermissions MemberPermissions { get; set; }
        // [JsonIgnore] public int MemberPermissionsId { get; set; }
    }
}