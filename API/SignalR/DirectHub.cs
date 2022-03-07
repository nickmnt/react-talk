using System;
using System.Threading.Tasks;
using Application.Chats;
using Application.Core;
using Application.Notifications;
using Application.Online;
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
            await _mediator.Send(new UpdateOnline.Command { Username = Context.User.Identity.Name });
            
            var users = await _mediator
                .Send(new ListInterested.Query { Username = Context.User.Identity.Name });
            
            foreach (var u in users.Value)
            {
                await Clients.User(u).SendAsync("Connected", new ConnectedDto
                {
                    Username = Context.User.Identity.Name
                });
            }
            
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var date = await _mediator
                .Send(new MakeOffline.Command { Username = Context.User.Identity.Name });
            var users = await _mediator
                .Send(new ListInterested.Query { Username = Context.User.Identity.Name });
            
            foreach (var u in users.Value)
            {
                await Clients.User(u).SendAsync("Disconnected", new DisconnectedDto
                {
                    Username = Context.User.Identity.Name,
                    LastSeen = date.Value
                });
            }
            
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SearchChats(Application.SearchChats.List.Query query)
        {
            var comment = await _mediator.Send(query);

            await Clients.Caller
                .SendAsync("ReceiveSearchResults", comment.Value);
        }
    }
}