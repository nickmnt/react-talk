using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Direct;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.ChannelChats
{
    public class AddMembers
    {
        public class Command : IRequest<Result<bool>>
        {
            public Guid Id { get; set; }
            public List<string> Members { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<bool>>
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
            public async Task<Result<bool>> Handle(Command request, CancellationToken cancellationToken)
            {
                var chat = await _context.UserChats
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.ChannelChat)
                    .FirstOrDefaultAsync(x => x.Chat.Id == request.Id, cancellationToken);

                if (chat == null)
                    return null;
                if (chat.Chat.Type != ChatType.Channel)
                {
                    return Result<bool>.Failure("Chat is not a channel.");
                }

                var curMembers = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.ChatId == chat.ChatId)
                    .Select(x => x.AppUser.UserName)
                    .ToListAsync(cancellationToken);
                
                var members = request.Members.Distinct();

                var targets = await _context.Users.Where(x => members.Contains(x.UserName)
                    && !curMembers.Contains(x.UserName))
                    .ToListAsync(cancellationToken);

                foreach (var target in targets)
                {
                    var userChat = new UserChat { Chat = chat.Chat, AppUser = target, MembershipType = MemberType.Normal};
                    _context.Add(userChat);
                }

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<bool>.Success(true);
                }
                else
                {
                    return Result<bool>.Failure("Couldn't add members to the database");
                }

            }
        }
    }
}