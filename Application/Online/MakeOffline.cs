using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Online
{
    public class MakeOffline
    {
        public class Command : IRequest<Result<DateTime>>
        {
            public string Username { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<DateTime>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            
            public async Task<Result<DateTime>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == request.Username, cancellationToken);

                if (user == null)
                {
                    return Result<DateTime>.Failure("Cannot find user");
                }

                user.IsOnline = false;
                user.LastSeen = DateTime.UtcNow;

                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    return Result<DateTime>.Success(user.LastSeen);
                }
                return Result<DateTime>.Failure("Failed to save changes to the database.");
            }
        }
    }
}