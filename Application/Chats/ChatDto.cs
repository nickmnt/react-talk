using System;
using System.Text.Json.Serialization;

namespace Application.Chats
{
    public class ChatDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        //Private Chat
        public int PrivateChatId { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        [JsonIgnore] public string ParticipantUsername { get; set; }
    }
}