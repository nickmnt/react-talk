using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain.Direct;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.ChannelChats
{
    public class Details
    {
        public class Query : IRequest<Result<ChannelDetailsDto>> 
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
        
        public class Handler : IRequestHandler<Query, Result<ChannelDetailsDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            
            public async Task<Result<ChannelDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.ChannelChat)
                    .FirstOrDefaultAsync(x => x.ChatId == request.ChatId, cancellationToken);

                if (userChat == null)
                {
                    return null;
                }

                var memberCount = await _context.UserChats
                    .CountAsync(x => x.ChatId == request.ChatId, cancellationToken);

                if (userChat.Chat.Type != ChatType.Channel)
                {
                    return Result<ChannelDetailsDto>.Failure("Requested chat is not a channel");
                }

                var result = new ChannelDetailsDto
                {
                    Description = userChat.Chat.ChannelChat.Description,
                    MemberCount = memberCount
                };

                return Result<ChannelDetailsDto>.Success(result);
            }
        }
    }
}