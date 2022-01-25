using System;
using System.Collections.Generic;

namespace Domain.Direct
{
    public class Chat
    {
        public Guid Id { get; set; }
        public ChatType Type { get; set; }
        public PrivateChat PrivateChat { get; set; }
        public GroupChat GroupChat { get; set; }
        public ChannelChat ChannelChat { get; set; }
        public ICollection<UserChat> Users { get; set; }
        public ICollection<Pin> Pins { get; set; } = new List<Pin>();
    }
}