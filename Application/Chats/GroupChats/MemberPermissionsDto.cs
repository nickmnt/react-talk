namespace Application.Chats.GroupChats
{
    public class MemberPermissionsDto
    {
        public bool SendMessages { get; set; }
        public bool SendMedia { get; set; }
        public bool AddUsers { get; set; }
        public bool PinMessages { get; set; }
        public bool ChangeChatInfo { get; set; }
    }
}