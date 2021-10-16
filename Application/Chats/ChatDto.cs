using System.Text.Json.Serialization;

namespace Application.Chats
{
    public class ChatDto
    {
        public string Id { get; set; }
        public string Type { get; set; }
        //Private Chat
        public string PrivateChatId { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        [JsonIgnore] public string ParticipantUsername { get; set; }
    }
}