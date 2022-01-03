using System;
using System.Threading.Tasks;
using Application.Chats;
using Application.Chats.ChannelChats;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ChannelController : BaseApiController
    {
        [HttpPost()]
        public async Task<IActionResult> CreateChannel(Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetails(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { ChatId = id }));
        }
        
    }
}