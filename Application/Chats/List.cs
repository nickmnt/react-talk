using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Messages;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats
{
    public class List
    {
        public class Query : IRequest<Result<List<ChatDto>>>
        {
            
        }
        
        public class Handler : IRequestHandler<Query, Result<List<ChatDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _accessor;
            
            public Handler(DataContext context, IMapper mapper, IUserAccessor accessor)
            {
                _context = context;
                _mapper = mapper;
                _accessor = accessor;
            }

            public async Task<Result<List<ChatDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(x => x.UserName == _accessor.GetUsername(), cancellationToken);
                if (user == null)
                    return null;

                var result = new List<ChatDto>();
                
                var chats = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Pins)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Users)
                    .ThenInclude(x => x.AppUser)
                    .Where(x => x.AppUser.UserName == user.UserName)
                    .ToListAsync(cancellationToken);

                foreach (var userChat in chats)
                {
                    var chat = userChat.Chat;

                    ChatDto mapped = null;
                    switch (chat.Type)
                    {
                        case ChatType.Channel:
                            mapped = ChatMapping.MapChannel(userChat, _mapper);
                            break;
                        case ChatType.Group:
                            mapped = ChatMapping.MapGroup(userChat, _mapper);
                            break;
                        case ChatType.PrivateChat:
                            mapped = _mapper.Map<ChatDto>(userChat);
                            break;
                    }

                    Message lastMessage = userChat.Chat.Messages.OrderByDescending
                        (x => x.CreatedAt).FirstOrDefault();;
                    
                    var beenSeen = false;
                    if (lastMessage?.Sender.UserName == _accessor.GetUsername())
                    {
                        beenSeen = _context.UserChats
                            .Include(x => x.AppUser)
                            .Any(x => x.AppUser.UserName != _accessor.GetUsername() &&
                                      x.LastSeen > lastMessage.CreatedAt);
                        
                    }

                    mapped!.LastMessage = _mapper.Map<MessageDto>(lastMessage);
                    mapped.LastMessageSeen = beenSeen;

                    int notSeenCount = userChat.Chat.Messages
                        .Count(x => x.CreatedAt > userChat.LastSeen);;
                    
                    mapped.NotSeenCount = notSeenCount;
                    
                    result.Add(mapped);
                }

                return Result<List<ChatDto>>.Success(result);
            }
        }
    }
}