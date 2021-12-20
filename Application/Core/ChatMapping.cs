using Application.Chats;
using Domain.Direct;

namespace Application.Core
{
    public class ChatMapping
    {
        public static ChatDto MapChannel(UserChat userChat)
        {
            return new ChatDto
            {
                Id = userChat.ChatId,
                Image = "",
                DisplayName = userChat.Chat.ChannelChat.Name,
                Type = (int)ChatType.Channel,
                ParticipantUsername = "",
                PrivateChatId = -1
            };
        }
        
        public static ChatDto MapGroup(UserChat userChat)
        {
            return new ChatDto
            {
                Id = userChat.ChatId,
                Image = "",
                DisplayName = userChat.Chat.GroupChat.Name,
                Type = (int)ChatType.Group,
                ParticipantUsername = "",
                PrivateChatId = -1
            };
        }
    }
}