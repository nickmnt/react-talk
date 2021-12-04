namespace Domain.Direct
{
    public class GroupMembership
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public int GroupId { get; set; }
        public GroupChat Group { get; set; }
        public MemberType MemberType { get; set; }
    }
}