using Domain.Direct;

namespace Domain
{
    public class Pin
    {
        public int Id { get; set; }
        public Message Message { get; set; }
        public int MessageId { get; set; }
        public AppUser AppUser { get; set; }
        public string AppUserId { get; set; }
        public bool IsMutual { get; set; }
    }
}