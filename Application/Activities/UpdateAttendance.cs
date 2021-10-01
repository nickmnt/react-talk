using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var activity = await _context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null)
                    return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                var host = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser;
                var hostUsername = host?.UserName;

                var attendance = activity.Attendees.
                    FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                if (host != null)
                    await _context.Entry(host).Collection(x => x.JoinNotifications)
                        .LoadAsync(cancellationToken);

                if (attendance != null && hostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);

                    var notification = host?.JoinNotifications
                        .First(x => x.Activity.Id == activity.Id && x.User.UserName == user.UserName);
                    host?.JoinNotifications.Remove(notification);
                }

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    
                    activity.Attendees.Add(attendance);
                    
                    host?.JoinNotifications.Add(new JoinNotification {Activity = activity, User = user});
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}