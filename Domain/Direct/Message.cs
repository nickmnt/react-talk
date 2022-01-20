using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Direct
{
    public class Message
    {
        public int Id { get; set; }
        public MessageType Type { get; set; }
        public AppUser Sender { get; set; }
        public string Body { get; set; }
        public string PublicId { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? ReplyToId { get; set; }
        [ForeignKey("ReplyToId")]
        public virtual Message ReplyTo { get; set; }
    }
}