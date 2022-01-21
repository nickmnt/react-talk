﻿using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats
{
    public class NotSeenCount
    {
        public class Query : IRequest<Result<int>>
        {
            public Guid ChatId { get; set; }
            public string TargetUserId { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<int>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            
            public async Task<Result<int>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.ChannelChat)
                    .ThenInclude(x => x.Messages)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.GroupChat)
                    .ThenInclude(x => x.Messages)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.PrivateChat)
                    .ThenInclude(x => x.Messages)
                    .Where(x => x.AppUserId == request.TargetUserId
                                && x.ChatId == request.ChatId)
                    .SingleOrDefaultAsync(cancellationToken);
                
                if (userChat == null)
                {
                    return Result<int>.Failure("User membership in chat, or the chat itself does not exist.");
                }

                var notSeenCount = userChat.Chat.Type switch
                {
                    ChatType.Channel => userChat.Chat.ChannelChat.Messages.Count(x => x.CreatedAt > userChat.LastSeen),
                    ChatType.Group => userChat.Chat.GroupChat.Messages.Count(x => x.CreatedAt > userChat.LastSeen),
                    ChatType.PrivateChat => userChat.Chat.PrivateChat.Messages.Count(x =>
                        x.CreatedAt > userChat.LastSeen),
                    _ => 0
                };
                
                

                return Result<int>.Success(notSeenCount);
            }
        }
    }
}