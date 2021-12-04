using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Direct;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Chats.GroupChats
{
    public class Create
    {
        public class Command : IRequest<Result<ChatDto>>
        {
            public string Name { get; set; }
            public List<string> Members { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Members).NotEmpty();
            }
        }
        
        public class Handler : IRequestHandler<Command, Result<ChatDto>>
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
            
            public Task<Result<ChatDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var groupChat = new GroupChat();
                var chat = new Chat {Type = }
            }
        }
    }
}