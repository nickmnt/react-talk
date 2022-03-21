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
    public class AddPrivateChat
    {
        public class Command : IRequest<Result<ChatDto>>
        {
            public string TargetUsername { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<ChatDto>>
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

            public async Task<Result<ChatDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _accessor.GetUsername(), cancellationToken);
                var target = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == request.TargetUsername, cancellationToken);
                
                if (user == null || target == null)
                    return null;
                
                var count = _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x =>
                        x.Chat)
                    .AsSplitQuery()
                    .Count(x => x.AppUser.UserName == request.TargetUsername && x.AppUser.UserName == _accessor.GetUsername()
                                                                             && x.Chat.Type == ChatType.PrivateChat);
                if(count == 2)
                    return Result<ChatDto>.Failure("Private chat already exists");

                var chat = new Chat { Type = ChatType.PrivateChat };

                _context.Add(chat);
                
                var userChat = new UserChat { Chat = chat, AppUser = user };
                var targetChat = new UserChat { Chat = chat, AppUser = target };

                _context.UserChats.Add(userChat);
                _context.UserChats.Add(targetChat);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                    return Result<ChatDto>.Success(_mapper.Map<UserChat,ChatDto>(userChat));
                
                return Result<ChatDto>.Failure("Failed to create the new private chat.");
            }
        }
    }
}