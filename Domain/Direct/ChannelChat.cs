using System.Collections.Generic;

namespace Domain.Direct
{
    public class ChannelChat
    {
        public int Id { get; set; }
        public ICollection<ChannelMembership> Members { get; set; }
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}