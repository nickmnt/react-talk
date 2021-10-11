using System.Text.Json.Serialization;

namespace Application.Chats
{
    public class ChatDto
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string PrivateChatId { get; set; }
        [JsonIgnore] public string ParticipantUsername { get; set; }
    }
}