﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
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
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<ChannelDetailsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.ChannelChat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .FirstOrDefaultAsync(x => x.ChatId == request.ChatId
                        && x.AppUser.UserName == _userAccessor.GetUsername(), cancellationToken);

                if (userChat == null)
                {
                    return null;
                }

                if (userChat.Chat.Type != ChatType.Channel)
                {
                    return Result<ChannelDetailsDto>.Failure("Requested chat is not a channel");
                }
                
                var memberCount = await _context.UserChats
                    .CountAsync(x => x.ChatId == request.ChatId, cancellationToken);

                var result = _mapper.Map<ChannelDetailsDto>(userChat.Chat.ChannelChat);
                result.MemberCount = memberCount;

                return Result<ChannelDetailsDto>.Success(result);
            }
        }
    }
}