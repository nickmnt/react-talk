using System;
using System.Threading.Tasks;
using API.DTOs;
using API.SignalR;
using Application.Chats;
using Application.Chats.ChannelChats;
using Application.Chats.UserChats;
using Application.Interfaces;
using Domain.Direct;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Create = Application.Messages.Create;
using Details = Application.Chats.PrivateChats.Details;


namespace API.Controllers
{
    public class DirectController : BaseApiController
    {
        private readonly IHubContext<DirectHub> _hubContext;
        private readonly IUserAccessor _accessor;

        public DirectController(IHubContext<DirectHub> hubContext, IUserAccessor accessor)
        {
            _hubContext = hubContext;
            _accessor = accessor;
        }

        [HttpPost()]
        public async Task<IActionResult> CreatePrivateChat(AddPrivateChat.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("privateChatDetails/{chatId}")]
        public async Task<IActionResult> GetPrivateChatDetails(Guid chatId)
        {
            var result = await Mediator.Send(new Details.Query {ChatId = chatId});
            
            return HandleResult(result);
        }

        [HttpPost("messages")]
        public async Task<IActionResult> CreateMessage(Create.Command command)
        {
            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                var users = await Mediator
                    .Send(new Application.Chats.UserChats.List.Query { ChatId = command.ChatId });
                
                foreach (var u in users.Value)
                {
                    var notSeenCount = await Mediator
                        .Send(new NotSeenCount.Query { ChatId = command.ChatId, TargetUserId = u });
                    await _hubContext.Clients.User(u).SendAsync("ReceiveNewMessage", new MessageNotifDto
                    {
                        Message = result.Value,
                        ChatId = command.ChatId,
                        NotSeenCount = notSeenCount.Value
                    });
                }
            }
            return HandleResult(result);
        }
        
        [HttpPost("photos")]
        public async Task<IActionResult> CreatePhoto([FromForm] Application.Messages.Images.Create.Command command)
        {
            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                var users = await Mediator
                    .Send(new Application.Chats.UserChats.List.Query { ChatId = command.ChatId });
                
                foreach (var u in users.Value)
                {
                    await _hubContext.Clients.User(u).SendAsync("ReceiveNewMessage", new MessageNotifDto
                    {
                        Message = result.Value,
                        ChatId = command.ChatId   
                    });
                }
            }
            return HandleResult(result);
        }
        
        [HttpPost("videos")]
        public async Task<IActionResult> CreateVideo([FromForm] Application.Messages.Videos.Create.Command command)
        {
            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                var users = await Mediator
                    .Send(new Application.Chats.UserChats.List.Query { ChatId = command.ChatId });
                
                foreach (var u in users.Value)
                {
                    await _hubContext.Clients.User(u).SendAsync("ReceiveNewMessage", new MessageNotifDto
                    {
                        Message = result.Value,
                        ChatId = command.ChatId   
                    });
                }
            }
            return HandleResult(result);
        }
        
        [HttpPost("updateSeen")]
        public async Task<IActionResult> UpdateSeen(UpdateSeen.Command command)
        {
            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                var users = await Mediator
                    .Send(new Application.Chats.UserChats.List.Query { ChatId = command.ChatId });
                
                foreach (var u in users.Value)
                {
                    await _hubContext.Clients.User(u).SendAsync("ReceiveNewSeen", 
                        new UpdatedSeenDto {Username = _accessor.GetUsername(), 
                            ChatId = command.ChatId,
                            LastSeen = command.NewLastSeen
                        });
                }
            }
            return HandleResult(result);
        }
        
        [HttpPost("addMember")]
        public async Task<IActionResult> AddMembers(AddMembers.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
        
        [HttpPost("removeMember")]
        public async Task<IActionResult> RemoveMember(RemoveMember.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}