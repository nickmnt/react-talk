using System.Collections.Generic;

namespace Application.Chats
{
    public class PinDto
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public bool IsMutual { get; set; }
    }
}