using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.GroupChats;

public class Leave
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid ChatId { get; set; }
    }
    
    public class Handler: IRequestHandler<Command, Result<Unit>>
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
                .SingleOrDefaultAsync(x => x.ChatId == request.ChatId &&
                                           x.AppUser.UserName == _accessor.GetUsername());

            if (userChat == null)
                return null;

            if (userChat.MembershipType == MemberType.Owner)
            {
                _context.Chats.Remove(userChat.Chat);
            }
            else
            {
                _context.UserChats.Remove(userChat);
            }

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Result<Unit>.Success(Unit.Value);
            }
            return Result<Unit>.Failure("Failed to save changes to database.");
        }
    }
}