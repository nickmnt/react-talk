using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
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
                var observer = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername(), cancellationToken);

                var target = await _context.Users
                    .Include(x => x.FollowNotifications)
                    .SingleOrDefaultAsync(x => x.UserName == request.TargetUsername, cancellationToken);

                if (target == null)
                {
                    return null;
                }

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.UserFollowings.Add(following);
                    
                    target.FollowNotifications.Add(new FollowNotification {Follower = observer});
                }
                else
                {
                    _context.UserFollowings.Remove(following);

                    var notification = target.FollowNotifications
                        .SingleOrDefault(x => x.Follower.UserName == target.UserName);
                    if (notification != null)
                        target.FollowNotifications.Remove(notification);
                }

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}