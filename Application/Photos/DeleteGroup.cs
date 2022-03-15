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
    public class DeleteGroup
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
            public Guid ChatId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
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
                {
                    return null;
                }

                if (photo.IsMain)
                {
                    return Result<Unit>.Failure("You cannot delete your main photo");
                }

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                {
                    return Result<Unit>.Failure("Problem deleting photo from Cloudinary");
                }

                userChat.Chat.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}