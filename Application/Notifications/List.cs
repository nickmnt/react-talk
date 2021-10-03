using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Notifications
{
    public class List
    {
        public class Query : IRequest<Result<NotificationsDto>>
        {
            
        }
        
        public class Handler : IRequestHandler<Query, Result<NotificationsDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            
            public async Task<Result<NotificationsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var notifications = await _context.Users
                    .ProjectTo<NotificationsDto>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x => x.Username == _userAccessor.GetUsername(),
                        cancellationToken);
                
                return Result<NotificationsDto>.Success(notifications);
            }
        }
    }
}