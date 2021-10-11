using System.Collections.Generic;

namespace Domain.Direct
{
    public class PrivateChat
    {
        public int Id { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}