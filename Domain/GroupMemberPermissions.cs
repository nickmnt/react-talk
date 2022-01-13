using System.Text.Json.Serialization;

namespace Domain
{
    public class GroupMemberPermissions
    {
        [JsonIgnore]
        public int Id { get; set; }
        public bool SendMessages { get; set; } = true;
        public bool SendMedia { get; set; } = true;
        public bool AddUsers { get; set; } = true;
        public bool PinMessages { get; set; } = true;
        public bool ChangeChatInfo { get; set; } = true;
    }
}