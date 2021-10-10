using System.Collections.Generic;

namespace Domain.Direct
{
    public class ChannelChat
    {
        public string Id { get; set; }
        public AppUser Owner { get; set; }
        public ICollection<ChannelMembership> Members { get; set; }
    }
}