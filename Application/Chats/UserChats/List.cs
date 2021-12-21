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

namespace Application.Chats.UserChats
{
    public class List
    {
        public class Query : IRequest<Result<List<string>>>
        {
            public Guid ChatId { get; set; }
        }

        public class Command : IRequestHandler<Query, Result<List<string>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Command(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }
            
            public async Task<Result<List<string>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChats = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.ChatId == request.ChatId && x.AppUser.UserName != _accessor.GetUsername())
                    .Select(x => x.AppUserId)
                    .ToListAsync(cancellationToken);

                return Result<List<string>>.Success(userChats);
            }
        }
    }
}