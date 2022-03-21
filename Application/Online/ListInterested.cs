using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Online
{
    public class ListInterested
    {
        public class Query : IRequest<Result<List<string>>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<string>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            
            public async Task<Result<List<string>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var followers = await _context.UserFollowings
                    .Include(x => x.Target)
                    .Include(x => x.Observer)
                    .Where(x => x.Target.UserName == request.Username)
                    .Select(x => x.Observer.Id)
                    .AsSplitQuery()
                    .ToListAsync(cancellationToken);
                
                var chatIds = new HashSet<Guid>(
                    await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.AppUser.UserName == request.Username)
                    .Select(x => x.ChatId)
                    .ToListAsync(cancellationToken));

                var otherParticipants = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.AppUser.UserName != request.Username
                                && chatIds.Contains(x.ChatId))
                    .Select(x => x.AppUser.Id)
                    .ToListAsync(cancellationToken);

                followers.AddRange(otherParticipants);
                return Result<List<string>>.Success(followers.Distinct().ToList());
            }
        }
        
    }
}