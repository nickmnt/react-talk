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
    public class UpdateSeen
    {
        public class Command : IRequest<Result<bool>>
        {
            public Guid ChatId { get; set; }
            public DateTime NewLastSeen { get; set; }
        }

        public class Handler : IRequestHandler<Command ,Result<bool>>
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
                    .Include(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.ChatId == request.ChatId
                        && x.AppUser.UserName == _accessor.GetUsername(), cancellationToken);

                if (userChat == null)
                    return null;

                if (request.NewLastSeen < userChat.LastSeen)
                {
                    return Result<bool>.Failure("New last seen is earlier than current last seen");
                }

                userChat.LastSeen = request.NewLastSeen;

                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    return Result<bool>.Success(true);
                }
                else
                {
                    return Result<bool>.Failure("Failed saving changes to database.");
                }
            }
        }
    }
}