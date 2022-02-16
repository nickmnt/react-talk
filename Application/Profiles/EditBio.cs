using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class EditBio
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Bio { get; set; }
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
                var user = _context.Users.First(x => x.UserName == _accessor.GetUsername());
                user.Bio = request.Bio ?? user.Bio;
                
                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                    return Result<Unit>.Success(Unit.Value);
                
                return Result<Unit>.Failure("Failed updating user's bio");
            }
        }
    }
}