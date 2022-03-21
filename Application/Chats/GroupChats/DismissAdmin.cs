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
    public class DismissAdmin
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid ChatId { get; set; }
            public string TargetUsername { get; set; }
        }
        
        public class Handler: IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChats = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .Where(x => x.ChatId == request.ChatId && (x.AppUser.UserName == _accessor.GetUsername() || x.AppUser.UserName == request.TargetUsername))
                    .AsSplitQuery()
                    .ToListAsync(cancellationToken);

                UserChat userChat = null;
                UserChat targetUChat = null;
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

                if (userChat == null || targetUChat == null)
                {
                    return Result<Unit>.Failure("Chat does not exist or you or the target are not members");
                }
                if (userChat.Chat.Type != ChatType.Group)
                {
                    return Result<Unit>.Failure("Chat is not a group");
                }
                if (userChat.MembershipType != MemberType.Owner && 
                    (userChat.MembershipType != MemberType.Admin || userChat.AddNewAdmins))
                {
                    return Result<Unit>.Failure("User is not the owner or an admin with the permission 'AddNewAdmins'.");
                }

                if (targetUChat.MembershipType == MemberType.Admin)
                {
                    targetUChat.MembershipType = MemberType.Normal;
                }
                
                targetUChat.DeleteMessages = true;
                targetUChat.BanUsers = true;
                targetUChat.AddNewAdmins = true;
                targetUChat.RemainAnonymous = true;
                targetUChat.CustomTitle = "";

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Couldn't save changes to database.");
            }
        }
    }
}