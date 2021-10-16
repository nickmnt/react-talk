using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Search;
using MediatR;

namespace Application.SearchChats
{
    public class List
    {
        public class Query : IRequest<Result<List<SearchResult>>>
        {
            
        }
        
        public class Handler : IRequestHandler<Query, Result<List<SearchResult>>>
        {
            public async Task<Result<List<SearchResult>>> Handle(Query request, CancellationToken cancellationToken)
            {
                
            }
        }
    }
}