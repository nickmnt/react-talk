using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.GroupChats
{
    public class UpdateMembersPermissions
    {
        public class Command : IRequest<Result<bool>>
        {
            public Guid ChatId { get; set; }
            public bool SendMessages { get; set; }
            public bool SendMedia { get; set; }
            public bool AddUsers { get; set; }
            public bool PinMessages { get; set; }
            public bool ChangeChatInfo { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<bool>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }

            public async Task<Result<bool>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var userChat = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.GroupChat)
                    .FirstOrDefaultAsync(x => x.AppUser.UserName == _accessor.GetUsername()
                                              && x.ChatId == request.ChatId, cancellationToken);

                if (userChat == null)
                {
                    return Result<bool>.Failure("Chat does not exist");
                }
                if (userChat.Chat.Type != ChatType.Group)
                {
                    return Result<bool>.Failure("Chat is not a group");
                }
                if (userChat.MembershipType != MemberType.Owner)
                {
                    return Result<bool>.Failure("User is not owner of the group.");
                }

                var entity = await 
                    _context.FindAsync<GroupMemberPermissions>(userChat.Chat.GroupChat.MemberPermissionsId);
                entity.SendMessages = request.SendMessages;
                entity.SendMedia = request.SendMedia;
                entity.AddUsers = request.AddUsers;
                entity.PinMessages = request.PinMessages;
                entity.ChangeChatInfo = request.ChangeChatInfo;
                                
                var result = await _context.SaveChangesAsync(cancellationToken);
                
                if (result > 0)
                    return Result<bool>.Success(true);
                else
                {
                    return Result<bool>.Failure("Failed saving the new permissions to database");   
                }
            }
        }
    }
}