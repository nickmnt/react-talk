using System;
using System.Collections.Generic;

namespace Domain.Direct
{
    public class Chat
    {
        public Guid Id { get; set; }
        public ChatType Type { get; set; }
        // For group chat && channel chat
        public string Name { get; set; }
        public string Description { get; set; }
        // For all chats
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<UserChat> Users { get; set; }
        // Member permissions
        public bool SendMessages { get; set; } = true;
        public bool SendMedia { get; set; } = true;
        public bool AddUsers { get; set; } = true;
        public bool PinMessages { get; set; } = true;
        public bool ChangeChatInfo { get; set; } = true;
        public ICollection<Pin> Pins { get; set; } = new List<Pin>();
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    }
}