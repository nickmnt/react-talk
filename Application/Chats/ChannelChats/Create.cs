using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Direct;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.ChannelChats
{
    public class Create
    {
        public class Command : IRequest<Result<ChatDto>>
        {
            public string Name { get; set; }
            public string Description { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
            }
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
                var channelChat = new ChannelChat();
                var chat = new Chat { Type = ChatType.Channel, ChannelChat = channelChat };

                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _accessor.GetUsername(), cancellationToken);

                var userChat = new UserChat { Chat = chat, AppUser = user };
                _context.UserChats.Add(userChat);
                
                var result = await _context.SaveChangesAsync(cancellationToken);
                if (result > 0)
                    return Result<ChatDto>.Success(_mapper.Map<UserChat,ChatDto>(userChat));
                
                return Result<ChatDto>.Failure("Failed to create the new channel.");
            }
        }
    }
}