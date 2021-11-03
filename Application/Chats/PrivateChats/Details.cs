using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
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
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.PrivateChat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .SingleOrDefaultAsync(x => x.ChatId == request.ChatId && 
                                               x.AppUser.UserName == _userAccessor.GetUsername(), cancellationToken);
                
                if (userChat?.Chat?.PrivateChat == null)
                    return null;

                return Result<PrivateChatDto>.Success(_mapper.Map<PrivateChatDto>(userChat.Chat.PrivateChat));
            }
        }
    }
}