using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Typing
{
    public class GetTypeInfo
    {
        public class Query : IRequest<Result<TypeResult>>
        {
            public Guid ChatId { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<TypeResult>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<TypeResult>> Handle(Query request, CancellationToken cancellationToken)
            {
                var members = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.AppUser.UserName != _userAccessor.GetUsername()
                                && x.ChatId == request.ChatId)
                    .Select(x => x.AppUserId)
                    .ToListAsync(cancellationToken);

                var displayName = await _context.Users
                    .Where(x => x.UserName == _userAccessor.GetUsername())
                    .Select(x => x.DisplayName)
                    .SingleOrDefaultAsync(cancellationToken);

                return Result<TypeResult>.Success(new TypeResult {Members = members, DisplayName = displayName});
            }
        }
    }
}