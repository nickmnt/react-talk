using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats
{
    public class List
    {
        public class Query : IRequest<Result<List<ChatDto>>>
        {
            
        }
        
        public class Handler : IRequestHandler<Query, Result<List<ChatDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _accessor;
            
            public Handler(DataContext context, IMapper mapper,IUserAccessor accessor)
            {
                _context = context;
                _mapper = mapper;
                _accessor = accessor;
            }

            public async Task<Result<List<ChatDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(x => x.UserName == _accessor.GetUsername(), cancellationToken);
                if (user == null)
                    return null;

                var chats = await _context.UserChats
                    .ProjectTo<ChatDto>(_mapper.ConfigurationProvider)
                    .Where(x => x.ParticipantUsername == user.UserName)
                    .ToListAsync(cancellationToken);

                return Result<List<ChatDto>>.Success(chats);
            }
        }
    }
}