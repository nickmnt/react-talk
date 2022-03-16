using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Application.Chats;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Direct;

namespace Application.Core
{
    public static class ChatMapping
    {
        public static ChatDto MapChannel(UserChat userChat, IMapper mapper)
        {
            return new ChatDto
            {
                Id = userChat.ChatId,
                Image = "",
                DisplayName = userChat.Chat.Name,
                Type = (int)ChatType.Channel,
                ParticipantUsername = null,
                Pins = mapper.Map<ICollection<Pin>, ICollection<PinDto>>(userChat.Chat.Pins),
                MembershipType = (int)userChat.MembershipType
            };
        }
        
        public static ChatDto MapGroup(UserChat userChat, IMapper mapper)
        {
            return new ChatDto
            {
                Id = userChat.ChatId,
                Image = userChat.Chat.Photos.FirstOrDefault(x => x.IsMain)?.Url ?? "",
                DisplayName = userChat.Chat.Name,
                Type = (int)ChatType.Group,
                ParticipantUsername = null,
                Pins = mapper.Map<ICollection<Pin>, ICollection<PinDto>>(userChat.Chat.Pins),
                MembershipType = (int)userChat.MembershipType
            };
        }
    }
}