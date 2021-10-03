using System;
using System.Threading.Tasks;
using Application.Notifications;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class NotificationHub : Hub
    {
        private readonly IMediator _mediator;

        public NotificationHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            var result = await _mediator.Send(new List.Query());
            await Clients.Caller.SendAsync("LoadNotifications", result.Value);
        }
    }
}