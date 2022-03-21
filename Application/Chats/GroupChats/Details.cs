using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Direct;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.GroupChats
{
    public class Details
    {
        public class Query : IRequest<Result<GroupDetailsDto>> 
        {
            public Guid ChatId { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(x => x.ChatId).NotEmpty();
            }
        }
        
        public class Handler : IRequestHandler<Query, Result<GroupDetailsDto>>
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
            
            public async Task<Result<GroupDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.ForwardedFrom)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Photos)
                    .OrderBy(x => x.LastSeen)
                    .AsSplitQuery()
                    .SingleOrDefaultAsync(x => x.ChatId == request.ChatId 
                                               && x.AppUser.UserName == _userAccessor.GetUsername(), cancellationToken);

                if (userChat == null)
                {
                    return null;
                }
                
                if (userChat.Chat.Type != ChatType.Group)
                {
                    return Result<GroupDetailsDto>.Failure("Requested chat is not a group");
                }
                
                var members = await _context.UserChats
                                    .ProjectTo<GroupMember>(_mapper.ConfigurationProvider)
                                    .Where(x => x.ChatId == request.ChatId)
                                    .ToListAsync(cancellationToken);

                var result = _mapper.Map<GroupDetailsDto>(userChat);
                result.Members = members;

                return Result<GroupDetailsDto>.Success(result);
            }
        }
    }
}