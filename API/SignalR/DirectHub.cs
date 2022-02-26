using System;
using System.Threading.Tasks;
using Application.Chats;
using Application.Core;
using Application.Notifications;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using List = Application.Chats.List;

namespace API.SignalR
{
    public class DirectHub : Hub
    {
        private readonly IMediator _mediator;

        public DirectHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SearchChats(Application.SearchChats.List.Query query)
        {
            var comment = await _mediator.Send(query);

            await Clients.Caller
                .SendAsync("ReceiveSearchResults", comment.Value);
        }
    }
}