using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
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
                    .ThenInclude(x => x.ChannelChat)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Users)
                    .ThenInclude(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.GroupChat)
                    .Where(x => x.AppUser.UserName == user.UserName)
                    .ToListAsync(cancellationToken);

                foreach (var userChat in chats)
                {
                    var chat = userChat.Chat;

                    switch (chat.Type)
                    {
                        case ChatType.Channel:
                            var channelDto = ChatMapping.MapChannel(userChat);
                            result.Add(channelDto);
                            break;
                        case ChatType.Group:
                            var groupDto = ChatMapping.MapGroup(userChat);
                            result.Add(groupDto);
                            break;
                        case ChatType.PrivateChat:
                            result.Add(_mapper.Map<ChatDto>(userChat));
                            break;
                    }
                }

                return Result<List<ChatDto>>.Success(result);
            }
        }
    }
}