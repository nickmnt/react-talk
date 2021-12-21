using System;
using System.Threading.Tasks;
using API.DTOs;
using API.SignalR;
using Application.Chats;
using Application.Chats.PrivateChats;
using Application.Chats.UserChats;
using Application.Messages;
using Domain.Direct;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;


namespace API.Controllers
{
    public class DirectController : BaseApiController
    {
        private readonly IHubContext<DirectHub> _hubContext;

        public DirectController(IHubContext<DirectHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost()]
        public async Task<IActionResult> CreatePrivateChat(PrivateChatStartDto command)
        {
            var result = await Mediator.Send(new AddPrivateChat.Command
                { TargetUsername = command.Username });
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
            var users = await Mediator
                .Send(new Application.Chats.UserChats.List.Query { ChatId = command.ChatId });
            
            if (result.IsSuccess)
            {
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
    }
}