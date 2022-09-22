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
        
        [HttpPut("updateMemberPermissions")]
        public async Task<IActionResult> UpdateMemberPermissions(UpdateMemberPermissions.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }
        
        [HttpPut("updateMembersPermissions")]
        public async Task<IActionResult> UpdateAllMembersPermissions(UpdateMembersPermissions.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }
        
        [HttpPut("updateAdminPermissions")]
        public async Task<IActionResult> UpdateAdminPermissions(UpdateAdminPermissions.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }

        [HttpPut("dismissAdmin")]
        public async Task<IActionResult> DismissAdmin(DismissAdmin.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }
        
        [HttpPut("updateDetails")]
        public async Task<IActionResult> UpdateDetails(UpdateDetails.Command command)
        {
            return HandleResult(await Mediator.Send(command));;
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> LeaveGroup(Guid id)
        {
            return HandleResult(await Mediator.Send(new Leave.Command { ChatId = id }));
        }
    }
}