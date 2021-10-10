namespace Domain.Direct
{
    public class ChannelMembership
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public string ChannelId { get; set; }
        public ChannelChat Channel { get; set; }
        public bool IsAdmin { get; set; }
    }
}