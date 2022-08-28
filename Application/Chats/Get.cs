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

namespace Application.Chats
{
    public class Get
    {
        public class Query : IRequest<Result<ChatDto>>
        {
            public Guid ChatId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ChatDto>>
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
            
            public async Task<Result<ChatDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats.Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Pins)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Users)
                    .ThenInclude(x => x.AppUser)
                    .ThenInclude(x => x.Photos)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Photos)
                    .AsSplitQuery()
                    .SingleOrDefaultAsync(x => x.ChatId == request.ChatId
                        && x.AppUser.UserName == _accessor.GetUsername(), cancellationToken);

                if (userChat == null)
                    return null;
                
                var chat = userChat.Chat;

                ChatDto mapped = List.MapUserChatToDto(userChat, _mapper);

                return Result<ChatDto>.Success(mapped);
            }
        }
    }
}