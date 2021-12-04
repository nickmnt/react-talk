using System.Threading.Tasks;
using Application.Chats.GroupChats;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public partial class GroupController : BaseApiController
    {
        [HttpPost()]
        public async Task<IActionResult> CreateGroup(Create.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }
    }
}