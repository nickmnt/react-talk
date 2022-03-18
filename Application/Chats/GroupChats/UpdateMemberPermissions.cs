using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Chats.GroupChats
{
    public class UpdateMemberPermissions
    {
        public class Command : IRequest<Result<MemberPermissionsDto>>
        {
            public Guid ChatId { get; set; }
            public string TargetUsername { get; set; }
            public bool SendMessages { get; set; }
            public bool SendMedia { get; set; }
            public bool AddUsers { get; set; }
            public bool PinMessages { get; set; }
            public bool ChangeChatInfo { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<MemberPermissionsDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }
            
            public async Task<Result<MemberPermissionsDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChats = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .Where(x => x.ChatId == request.ChatId && (x.AppUser.UserName == _accessor.GetUsername() || x.AppUser.UserName == request.TargetUsername))
                    .ToListAsync(cancellationToken);

                UserChat userChat = null;
                UserChat targetUChat = null;
                if (_accessor.GetUsername() == request.TargetUsername)
                {
                    userChat = userChats[0];
                    targetUChat = userChat;
                }
                else
                {
                    foreach (var uChat in userChats)
                    {
                        if (uChat.AppUser.UserName == _accessor.GetUsername())
                        {
                            userChat = uChat;
                        }
                        else
                        {
                            targetUChat = uChat;
                        }
                    }    
                }
                
                if (userChat == null || targetUChat == null)
                {
                    return Result<MemberPermissionsDto>.Failure("Membership does not exist");
                }
                if (userChat.Chat.Type != ChatType.Group)
                {
                    return Result<MemberPermissionsDto>.Failure("Chat is not a group");
                }
                if (userChat.MembershipType != MemberType.Owner && userChat.MembershipType != MemberType.Admin)
                {
                    return Result<MemberPermissionsDto>.Failure("User is not the owner or an admin of the group.");
                }

                targetUChat.SendMessages = request.SendMessages;
                targetUChat.SendMedia = request.SendMedia;
                targetUChat.AddUsers = request.AddUsers;
                targetUChat.PinMessages = request.PinMessages;
                targetUChat.ChangeChatInfo = request.ChangeChatInfo;
                
                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    var dto = new MemberPermissionsDto
                    {
                        SendMessages = targetUChat.SendMessages,
                        SendMedia = targetUChat.SendMedia,
                        AddUsers = targetUChat.AddUsers,
                        PinMessages = targetUChat.PinMessages,
                        ChangeChatInfo = targetUChat.ChangeChatInfo
                    };
                    return Result<MemberPermissionsDto>.Success(dto);
                }

                return Result<MemberPermissionsDto>.Failure("Failed saving the new permissions to database");
            }
        }
    }
}