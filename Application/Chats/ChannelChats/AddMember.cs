using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using FluentValidation;
using MediatR;

namespace Application.Chats.ChannelChats
{
    public class AddMember
    {
        public class Command : IRequest<Result<bool>>
        {
            public Guid Id { get; set; }
            public List<string> Members { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Create.Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<bool>>
        {
            public async Task<Result<bool>> Handle(Command request, CancellationToken cancellationToken)
            {
                
            }
        }
    }
}