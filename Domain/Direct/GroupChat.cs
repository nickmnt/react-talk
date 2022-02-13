using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Domain.Direct
{
    public class GroupChat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Message> Messages { get; set; } = new List<Message>();

        [JsonIgnore] public int? MemberPermissionsId { get; set; }
    }
}