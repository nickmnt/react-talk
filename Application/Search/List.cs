using System;
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
                var query = _context.Users
                    .Include(x => x.Photos)
                    .Select(x => new SearchResult
                    {
                        DisplayName = x.DisplayName,
                        Username = x.UserName,
                        Image = x.Photos.SingleOrDefault(p => p.IsMain).Url,
                    })
                    .Where(x => x.DisplayName.Contains(request.Term) || x.Username.Contains(request.Term))
                    .OrderBy(x => x.DisplayName)
                    .Take(10);

                var result = await query.ToListAsync(cancellationToken);

                foreach (var x in result)
                {
                    x.StartIndexDisp = x.DisplayName.IndexOf(request.Term, StringComparison.Ordinal);
                    x.StartIndexUser = x.Username.IndexOf(request.Term, StringComparison.Ordinal);
                }
                return Result<List<SearchResult>>.Success(result);
            }
        }
    }
}