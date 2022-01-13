using System.Collections.Generic;
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

namespace Application.Chats.GroupChats
{
    public class Create
    {
        public class Command : IRequest<Result<ChatDto>>
        {
            public string Name { get; set; }
            public List<string> Members { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Members).NotEmpty();
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
                var groupChat = new GroupChat {Name = request.Name, Description = null };
                var chat = new Chat { Type = ChatType.Group, GroupChat = groupChat };

                var members = request.Members.Distinct();
                
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _accessor.GetUsername(), cancellationToken);

                var targets = await _context.Users
                    .Where(x => members.Contains(x.UserName)).ToListAsync(cancellationToken);

                if (targets.Count == 0)
                    return Result<ChatDto>.Failure("There are 0 valid members");
      
                var userChat = new UserChat { Chat = chat, AppUser = user, MembershipType = MemberType.Owner };
                _context.UserChats.Add(userChat);
                
                
                foreach(var target in targets)
                {
                    var targetChat = new UserChat { Chat = chat, AppUser = target };
                    _context.UserChats.Add(targetChat);
                }
                
                var result = await _context.SaveChangesAsync(cancellationToken);
                if (result > 0)
                    return Result<ChatDto>.Success(ChatMapping.MapGroup(userChat));
                
                return Result<ChatDto>.Failure("Failed to create the new group chat.");
            }
        }
    }
}