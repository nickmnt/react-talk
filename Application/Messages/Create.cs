using System;
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
        }

        public class Handler : IRequestHandler<Command, Result<MessageDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            
            public async Task<Result<MessageDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userChat = await _context
                    .UserChats
                    .SingleOrDefaultAsync(x => x.ChatId == request.ChatId, cancellationToken);

                if (userChat == null)
                    return null;

                var message = new Message { Body = request.Body };
                
                userChat.Chat.PrivateChat.Messages.Add(message);

                var result = await _context.SaveChangesAsync(cancellationToken);

                if (result > 0)
                    return Result<MessageDto>.Success(_mapper.Map<MessageDto>(result));
                else
                    return Result<MessageDto>.Failure("Failed to add the message to the private chat");
            }
        }
    }
}