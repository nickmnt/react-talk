using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Online
{
    public class UpdateOnline
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Username { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(x => x.UserName == request.Username, cancellationToken);

                if (user == null)
                {
                    return Result<Unit>.Failure("User not found.");
                }

                user.IsOnline = true;

                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed saving changes to the database.");
            }
        }
    }
}