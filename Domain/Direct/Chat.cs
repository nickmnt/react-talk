using System;
using System.Collections.Generic;

namespace Domain.Direct
{
    public class Chat
    {
        public static readonly string PrivateType = "privateChat";
        public Guid Id { get; set; }
        public string Type { get; set; }
        public PrivateChat PrivateChat { get; set; }
        public ICollection<UserChat> Users { get; set; }
    }
}