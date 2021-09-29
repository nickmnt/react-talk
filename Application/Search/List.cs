using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
    public class List
    {
        public class Query : IRequest<Result<List<SearchResult>>>
        {
            public string Term { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<List<SearchResult>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            
            public async Task<Result<List<SearchResult>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Users.Where(x => x.UserName.Contains(request.Term)).ProjectTo<SearchResult>(_mapper.ConfigurationProvider);
                return Result<List<SearchResult>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
    }
}