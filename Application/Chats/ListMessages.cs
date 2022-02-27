using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Messages;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats
{
    public class ListMessages
    {
        public class Query : IRequest<Result<PagedList<MessageDto>>>
        {
            public Guid ChatId { get; set; }
            public PagingParams Params { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<PagedList<MessageDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor accessor)
            {
                _context = context;
                _mapper = mapper;
                _accessor = accessor;
            }
            
            public async Task<Result<PagedList<MessageDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.ChatId == request.ChatId && x.AppUser.UserName == _accessor.GetUsername())
                    .SingleOrDefaultAsync(cancellationToken);

                if (userChat == null)
                {
                    return Result<PagedList<MessageDto>>.Failure("Access denied.");
                }

                var query = _context.Messages
                    .Where(x => x.ChatId == request.ChatId)
                    .OrderByDescending(x => x.CreatedAt)
                    .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                return Result<PagedList<MessageDto>>
                    .Success(await PagedList<MessageDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}