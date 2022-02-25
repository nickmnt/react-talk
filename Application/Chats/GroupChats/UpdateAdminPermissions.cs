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
    public class UpdateAdminPermissions
    {
        public class Command : IRequest<Result<AdminPermissionsDto>>
        {
            public Guid ChatId { get; set; }
            public string TargetUsername { get; set; }
            public bool DeleteMessages { get; set; } = true;
            public bool BanUsers { get; set; } = true;
            public bool AddNewAdmins { get; set; } = true;
            public bool RemainAnonymous { get; set; } = true;
            public string CustomTitle { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<AdminPermissionsDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }
            
            public async Task<Result<AdminPermissionsDto>> Handle(Command request, CancellationToken cancellationToken)
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
                    return Result<AdminPermissionsDto>.Failure("Chat does not exist or you or the target are not members");
                }
                if (userChat.Chat.Type != ChatType.Group)
                {
                    return Result<AdminPermissionsDto>.Failure("Chat is not a group");
                }
                if (userChat.MembershipType != MemberType.Owner && 
                    !(userChat.MembershipType == MemberType.Admin && userChat.AddNewAdmins))
                {
                    return Result<AdminPermissionsDto>.Failure("User is not the owner or an admin with the permission 'AddNewAdmins'.");
                }

                if (targetUChat.MembershipType == MemberType.Normal)
                {
                    targetUChat.MembershipType = MemberType.Admin;
                }
                
                targetUChat.DeleteMessages = request.DeleteMessages;
                targetUChat.BanUsers = request.BanUsers;
                targetUChat.AddNewAdmins = request.AddNewAdmins;
                targetUChat.RemainAnonymous = request.RemainAnonymous;
                targetUChat.CustomTitle = request.CustomTitle;

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    var dto = new AdminPermissionsDto
                    {
                        DeleteMessages = userChat.DeleteMessages,
                        BanUsers = userChat.BanUsers,
                        AddNewAdmins = userChat.AddNewAdmins,
                        RemainAnonymous = userChat.RemainAnonymous,
                        CustomTitle = userChat.CustomTitle
                    };
                    return Result<AdminPermissionsDto>.Success(dto);
                }
                return Result<AdminPermissionsDto>.Failure("Couldn't save changes to database.");
            }
        }
    }
}