using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain.Direct;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.GroupChats
{
    public class UpdateDetails
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid ChatId { get; set; }
            public string DisplayName { get; set; }
            public string Description { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .Where(x => x.ChatId == request.ChatId && (x.AppUser.UserName == _accessor.GetUsername())
                        && (x.MembershipType == MemberType.Owner || x.MembershipType == MemberType.Admin))
                    .SingleOrDefaultAsync(cancellationToken);

                if (userChat == null)
                {
                    return Result<Unit>.Failure("Cannot access group settings.");
                }

                userChat.Chat.Name = request.DisplayName;
                userChat.Chat.Description = request.Description;
                
                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Failed saving the new group details to database");
            }
        }
    }
}