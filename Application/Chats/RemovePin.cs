using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats
{
    public class RemovePin
    {
        public class Command : IRequest<Result<bool>>
        {
            public Guid ChatId { get; set; }
            public int PinId { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<bool>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }
            
            public async Task<Result<bool>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Pins)
                    .Where(x => x.ChatId == request.ChatId)
                    .FirstOrDefaultAsync(cancellationToken);

                if (userChat == null)
                {
                    return Result<bool>.Failure("User is not part of the chat.");
                }

                var pin = userChat.Chat.Pins.FirstOrDefault(x => x.Id == request.PinId);

                if (pin == null)
                {
                    return Result<bool>.Failure("Pin is not part of the chat.");
                }

                userChat.Chat.Pins.Remove(pin);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<bool>.Success(true);
                }

                return Result<bool>.Failure("Couldn't remove pin from the DB.");
            }
        }
    }
}