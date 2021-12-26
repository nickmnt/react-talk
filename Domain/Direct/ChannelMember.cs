using System;
using System.Text.Json.Serialization;

namespace Domain.Direct
{
    public class ChannelMember
    {
        public MemberType MemberType { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public DateTime LastSeen { get; set; }
        [JsonIgnore] public Guid ChatId { get; set; }
    }
}