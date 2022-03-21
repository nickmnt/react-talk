using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.PrivateChats
{
    public class Details
    {
        public class Query : IRequest<Result<PrivateChatDto>>
        {
            public Guid ChatId { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<PrivateChatDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<PrivateChatDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context
                    .UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.ForwardedFrom)
                    .AsSplitQuery()
                    .Where(x => x.ChatId == request.ChatId)
                    .ToListAsync(cancellationToken);

                UserChat mine = null;
                UserChat other = null;

                foreach (var u in userChat)
                {
                    if (u.AppUser.UserName == _userAccessor.GetUsername())
                    {
                        mine = u;
                    }
                    else
                    {
                        other = u;
                    }
                }

                if (mine == null)
                    return Result<PrivateChatDto>.Failure("Unauthorized, you are not part of this chat.");

                if (other == null)
                    return Result<PrivateChatDto>.Failure("You are the only participant in this chat");

                if (mine.Chat.Type != ChatType.PrivateChat)
                    return null;

                var result = _mapper.Map<PrivateChatDto>(mine.Chat);
                result.MyLastSeen = mine.LastSeen;
                result.OtherLastSeen = other.LastSeen;
                result.OtherUserId = other.AppUserId;
                result.OtherUsername = other.AppUser.UserName;

                return Result<PrivateChatDto>.Success(result);
            }
        }
    }
}