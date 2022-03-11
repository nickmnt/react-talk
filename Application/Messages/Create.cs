using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Direct;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class Create
    {
        public class Command : IRequest<Result<MessageDto>>
        {
            public Guid ChatId { get; set; }
            public string Body { get; set; }
            public int ReplyToMessageId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<MessageDto>>
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
            
            public async Task<Result<MessageDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                UserChat userChat = null;
                if (request.ReplyToMessageId != -1)
                { 
                    userChat = await _context
                        .UserChats
                        .Include(x => x.AppUser)
                        .Include(x => x.Chat)
                        .ThenInclude(x => x.Messages)
                        .SingleOrDefaultAsync(x => x.ChatId == request.ChatId && 
                                                   x.AppUser.UserName == _userAccessor.GetUsername(), cancellationToken);
                }
                else
                {
                    userChat = await _context
                        .UserChats
                        .Include(x => x.AppUser)
                        .Include(x => x.Chat)
                        .SingleOrDefaultAsync(x => x.ChatId == request.ChatId && 
                                                   x.AppUser.UserName == _userAccessor.GetUsername(), cancellationToken);
                }
               

                if (userChat == null)
                    return null;
                
                Message replyTo = userChat.Chat.Messages.FirstOrDefault(x => x.Id == request.ReplyToMessageId);
                if (request.ReplyToMessageId != -1)
                {
                    if (replyTo == null)
                    {
                        return Result<MessageDto>.Failure("The messages you wanted to reply to does not exist in the chat");
                    }
                }

                var message = new Message
                {
                    Type = MessageType.Text,
                    Body = request.Body,
                    Sender = userChat.AppUser,
                    ReplyTo = replyTo
                };

                userChat.Chat.Messages.Add(message);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                    return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message));
                else
                    return Result<MessageDto>.Failure("Failed to add the message to the private chat");
            }
        }
    }
}