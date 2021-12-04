using System.Threading.Tasks;
using Application.Chats.ChannelChats;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ChannelController : BaseApiController
    {
        [HttpPost("channels")]
        public async Task<IActionResult> CreateChannel(Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
        
        [HttpPost("channels/addMember")]
        public async Task<IActionResult> AddChannelMembers(Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}