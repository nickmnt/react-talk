using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Core;
using Application.Search;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SearchController : BaseApiController
    {
        [HttpGet("{term}")]
        public async Task<ActionResult<List<SearchResult>>> SearchUsers(string term)
        {
            return HandleResult(await Mediator.Send(new List.Query { Term = term }));
        }
        
        // [HttpGet("chats/{term}")]
        // public async Task<ActionResult<List<SearchResult>>> SearchChats(string term)
        // {
        //     // Implement later
        //     return HandleResult(await Mediator.Send(new List.Query { Term = term }));
        // }
    }
}