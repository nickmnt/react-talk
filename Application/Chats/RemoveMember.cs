using System;
using System.Linq;
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

namespace Application.Chats
{
    public class RemoveMember
    {
        public class Command : IRequest<Result<bool>>
        {
            public Guid ChatId { get; set; }
            public string Username { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.ChatId).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
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
                var userChats = await _context.UserChats
                    .Include(x => x.Chat)
                    .Include(x => x.AppUser)
                    .Where(x => x.Chat.Id == request.ChatId)
                    .ToListAsync(cancellationToken);

                if (userChats.Count == 0)
                    return null;
                if (userChats[0].Chat.Type != ChatType.Channel && userChats[0].Chat.Type != ChatType.Group)
                {
                    return Result<bool>.Failure("Chat is not a channel or group.");
                }

                if (userChats.All(x => x.AppUser.UserName != request.Username))
                {
                    return Result<bool>.Failure("The user you want to remove is not a member of this chat.");
                }
                
                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<bool>.Success(true);
                }
                else
                {
                    return Result<bool>.Failure("Couldn't remove the member from the database");
                }
            }
        }
    }
}