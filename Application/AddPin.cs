using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Chats;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application
{
    public class AddPin
    {
        public class Command : IRequest<Result<PinDto>>
        {
            public Guid ChatId { get; set; }
            public int MessageId { get; set; }
            public bool IsMutual { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<PinDto>>
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
            
            public async Task<Result<PinDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChat = await _context.UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.Pins)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.ChannelChat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.GroupChat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Include(x => x.Chat)
                    .ThenInclude(x => x.PrivateChat)
                    .ThenInclude(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                    .Where(x => x.AppUser.UserName == _accessor.GetUsername() && x.ChatId == request.ChatId)
                    .FirstOrDefaultAsync(cancellationToken);

                if (userChat == null)
                {
                    return Result<PinDto>.Failure("Chat does not exist, or user is not a member.");
                }

                Message message = null;
                switch (userChat.Chat.Type)
                {
                    case ChatType.PrivateChat:
                        message = userChat.Chat.PrivateChat.Messages
                            .FirstOrDefault(x => x.Id == request.MessageId);
                        break;
                    case ChatType.Group:
                        message = userChat.Chat.GroupChat.Messages
                            .FirstOrDefault(x => x.Id == request.MessageId);
                        break;
                    case ChatType.Channel:
                        message = userChat.Chat.ChannelChat.Messages
                            .FirstOrDefault(x => x.Id == request.MessageId);
                        break;
                }

                if (message == null)
                {
                    return Result<PinDto>.Failure("Then message you want to pin does not exist in chat.");
                }

                var pin = new Pin
                {
                    Message = message,
                    AppUser = userChat.AppUser,
                    IsMutual = request.IsMutual
                };

                _context.Add(pin);

                userChat.Chat.Pins.Add(pin);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                {
                    return Result<PinDto>.Success(_mapper.Map<PinDto>(pin));
                }
                return Result<PinDto>.Failure("Pin couldn't be saved to the database.");
            }
        }
    }
}