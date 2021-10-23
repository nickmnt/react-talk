using System.Threading.Tasks;
using API.DTOs;
using Application.Chats;
using Application.Messages;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DirectController : BaseApiController
    {
        [HttpPost]
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
    }
}