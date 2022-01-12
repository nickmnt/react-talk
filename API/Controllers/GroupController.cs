using System;
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
        
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetails(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { ChatId = id }));
        }
        
        [HttpPost("updateMembersPermissions")]
        public async Task<IActionResult> UpdateAllMembersPermissions(UpdateMembersPermissions.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }
    }
}