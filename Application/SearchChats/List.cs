using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Search;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.SearchChats
{
    public class List
    {
        public class Query : IRequest<Result<List<SearchChatDto>>>
        {
            public string Term { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<List<SearchChatDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<List<SearchChatDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Users
                    .Where(x => x.UserName.Contains(request.Term) && x.UserName != _userAccessor.GetUsername())
                    .ProjectTo<SearchChatDto>(_mapper.ConfigurationProvider);
                return Result<List<SearchChatDto>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
    }
}