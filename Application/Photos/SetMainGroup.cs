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

namespace Application.Photos
{
    public class SetMainGroup
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
            public Guid ChatId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.AppUser.UserName == _userAccessor.GetUsername()
                                              && x.ChatId == request.ChatId
                                              && x.Chat.Type == ChatType.Group);

                if (userChat == null)
                    return null;

                var photo = userChat.Chat.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                    return null;

                var currentMain = userChat.Chat.Photos.FirstOrDefault(x => x.IsMain);

                if (currentMain != null)
                {
                    currentMain.IsMain = false;
                }

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}