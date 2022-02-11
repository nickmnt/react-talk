using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.Messages;

namespace Application.Chats
{
    public class ChatDto
    {
        public Guid Id { get; set; }
        public int Type { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public MessageDto LastMessage { get; set; }
        public bool LastMessageSeen { get; set; }
        public int NotSeenCount { get; set; }
        public string ParticipantUsername { get; set; }
        public int MembershipType { get; set; }
        public ICollection<PinDto> Pins { get; set; } = new List<PinDto>();
    }
}