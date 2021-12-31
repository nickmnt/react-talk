using System;
using System.Threading.Tasks;
using API.DTOs;
using API.SignalR;
using Application.Chats;
using Application.Chats.PrivateChats;
using Application.Chats.UserChats;
using Application.Interfaces;
using Application.Messages;
using Domain.Direct;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;


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
        public async Task<IActionResult> CreatePrivateChat(PrivateChatStartDto command)
        {
            var result = await Mediator.Send(new AddPrivateChat.Command
                { TargetUserId = command.TargetUserId });
            if (result.IsSuccess && result.Value != null)
            {
                var finalResult = await Mediator.Send(new Create.Command
                    { Body = command.Body, ChatId = result.Value.Id });
                if (finalResult.IsSuccess && finalResult.Value != null)
                {
                    return Ok(new PrivateChatResultDto { Message = finalResult.Value, ChatId = result.Value.Id });
                }

                return NotFound();
            }
            else
            {
                return HandleResult(result);
            }
        }

        [HttpGet("privateChatDetails/{chatId}")]
        public async Task<IActionResult> GetPrivateChatDetails(Guid chatId)
        {
            var result = await Mediator.Send(new Details.Query {ChatId = chatId});
            
            return HandleResult(result);
        }

        [HttpPost("messages")]
        public async Task<IActionResult> CreateMessage(CreateMessageDto command)
        {
            var result = await Mediator.Send(new Create.Command { Body = command.Body, ChatId = command.ChatId });
            
            if (result.IsSuccess)
            {
                var users = await Mediator
                    .Send(new Application.Chats.UserChats.List.Query { ChatId = command.ChatId });
                
                foreach (var u in users.Value)
                {
                    await _hubContext.Clients.User(u).SendAsync("ReceiveNewMessage", result.Value);
                }
            }
            return HandleResult(result);
        }
        
        [HttpPost("photos")]
        public async Task<IActionResult> CreatePhoto([FromForm] Application.Messages.Images.Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
        
        [HttpPost("videos")]
        public async Task<IActionResult> CreateVideo([FromForm] Application.Messages.Videos.Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
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
                            LastSeen = command.NewLastSeen});
                }
            }
            return HandleResult(result);
        }
    }
}