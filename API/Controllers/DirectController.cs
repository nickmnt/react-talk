using System;
using System.Threading.Tasks;
using API.DTOs;
using Application.Chats;
using Application.Chats.PrivateChats;
using Application.Messages;
using Domain.Direct;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DirectController : BaseApiController
    {
        [HttpPost()]
        public async Task<IActionResult> CreateActivity(PrivateChatStartDto command)
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