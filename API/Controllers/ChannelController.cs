using System.Threading.Tasks;
using Application.Chats.ChannelChats;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public partial class DirectController
    {
        [HttpPost("channels")]
        public async Task<IActionResult> CreateChannel(Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}