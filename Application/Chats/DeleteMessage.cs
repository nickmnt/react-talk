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

namespace Application.Chats
{
    public class DeleteMessage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid ChatId { get; set; }
            public int MessageId { get; set; }
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
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .AsSplitQuery()
                    .SingleOrDefaultAsync(
                        x => x.ChatId == request.ChatId && x.AppUser.UserName == _accessor.GetUsername(),
                        cancellationToken);

                if (userChat == null)
                {
                    return Result<Unit>.Failure("User is not part of the chat, or the chat does not exist.");
                }

                var message = userChat.Chat.Messages.SingleOrDefault(x => x.Id == request.MessageId);

                if (message == null)
                {
                    return Result<Unit>.Failure("Message does not exist.");
                }

                if (message.Sender.UserName != _accessor.GetUsername() && 
                    !(userChat.Chat.Type == ChatType.Group && 
                      (userChat.MembershipType == MemberType.Admin && userChat.DeleteMessages ||
                       userChat.MembershipType == MemberType.Owner)))
                {
                    return Result<Unit>.Failure("Does not have permission to delete the message.");
                }

                userChat.Chat.Messages.Remove(message);

                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to save changes to database.");
            }
        }
    }
}