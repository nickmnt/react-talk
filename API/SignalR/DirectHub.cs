using System;
using System.Threading.Tasks;
using Application.Chats;
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

        public override async Task OnConnectedAsync()
        {
            var result = await _mediator.Send(new List.Query());
            await Clients.Caller.SendAsync("LoadChats", result.Value);
        }
    }
}