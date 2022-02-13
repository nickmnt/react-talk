using System;
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
            public bool DeleteMessages { get; set; } = true;
            public bool BanUsers { get; set; } = true;
            public bool AddNewAdmins { get; set; } = true;
            public bool RemainAnonymous { get; set; } = true;
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
                var userChat = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .SingleOrDefaultAsync(x => x.AppUser.UserName == _accessor.GetUsername(), cancellationToken);
                
                if (userChat == null)
                {
                    return Result<AdminPermissionsDto>.Failure("Chat does not exist");
                }
                if (userChat.Chat.Type != ChatType.Group)
                {
                    return Result<AdminPermissionsDto>.Failure("Chat is not a group");
                }
                if (userChat.MembershipType != MemberType.Admin)
                {
                    return Result<AdminPermissionsDto>.Failure("User is not the owner or an admin of the group.");
                }
                if (userChat.MembershipType != MemberType.Owner && 
                    (userChat.MembershipType != MemberType.Admin || userChat.AddNewAdmins))
                {
                    return Result<AdminPermissionsDto>.Failure("User is not the owner or an admin with the permission 'AddNewAdmins'.");
                }

                userChat.DeleteMessages = request.DeleteMessages;
                userChat.BanUsers = request.BanUsers;
                userChat.AddNewAdmins = request.AddNewAdmins;
                userChat.RemainAnonymous = request.RemainAnonymous;

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    var dto = new AdminPermissionsDto
                    {
                        DeleteMessages = userChat.DeleteMessages,
                        BanUsers = userChat.BanUsers,
                        AddNewAdmins = userChat.AddNewAdmins,
                        RemainAnonymous = userChat.RemainAnonymous
                    };
                    return Result<AdminPermissionsDto>.Success(dto);
                }
                return Result<AdminPermissionsDto>.Failure("Couldn't save changes to database.");
            }
        }
    }
}