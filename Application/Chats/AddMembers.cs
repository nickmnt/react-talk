using System;
using System.Collections.Generic;
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
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats
{
    public class AddMembers
    {
        public class Command : IRequest<Result<List<GroupMember>>>
        {
            public Guid Id { get; set; }
            public string[] Members { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<List<GroupMember>>>
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
            
            public async Task<Result<List<GroupMember>>> Handle(Command request, CancellationToken cancellationToken)
            {
                var chat = await _context.UserChats
                    .Include(x => x.Chat)
                    .Include(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.Chat.Id == request.Id && x.AppUser.UserName == _accessor.GetUsername(), cancellationToken);

                if (chat == null)
                    return null;
                if (chat.Chat.Type != ChatType.Channel && chat.Chat.Type != ChatType.Group)
                {
                    return Result<List<GroupMember>>.Failure("Chat is not a channel or group.");
                }

                var curMembers = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Where(x => x.ChatId == chat.ChatId)
                    .Select(x => x.AppUser.UserName)
                    .ToListAsync(cancellationToken);
                
                var members = request.Members.Distinct();

                var targets = await _context.Users.Where(x => members.Contains(x.UserName)
                    && !curMembers.Contains(x.UserName))
                    .AsSingleQuery()
                    .ToListAsync(cancellationToken);

                var usernames = targets.Select(x => x.UserName);

                foreach (var target in targets)
                {
                    var userChat = new UserChat { Chat = chat.Chat, AppUser = target, MembershipType = MemberType.Normal};
                    _context.Add(userChat);
                }
                
                var groupMembers = await _context.UserChats
                    .ProjectTo<GroupMember>(_mapper.ConfigurationProvider)
                    .Where(x => usernames.Contains(x.Username))
                    .ToListAsync(cancellationToken);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<List<GroupMember>>.Success(groupMembers);
                }
                return Result<List<GroupMember>>.Failure("Couldn't add members to the database");
            }
        }
    }
}