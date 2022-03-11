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
    public class AddSavedChat
    {
        public class Command : IRequest<Result<ChatDto>>
        {
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

                if (user == null)
                    return null;
                
                var count = _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x =>
                        x.Chat)
                    .Count(x => x.AppUser.UserName == _accessor.GetUsername()
                                && x.Chat.Type == ChatType.Saved);
                if(count == 1)
                    return Result<ChatDto>.Failure("Saved messages chat already exists");

                var chat = new Chat { Type = ChatType.Saved };

                _context.Add(chat);
                
                var userChat = new UserChat { Chat = chat, AppUser = user };

                _context.UserChats.Add(userChat);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                    return Result<ChatDto>.Success(_mapper.Map<UserChat,ChatDto>(userChat));
                
                return Result<ChatDto>.Failure("Failed to create the new saved messages chat.");
            }
        }
    }
}