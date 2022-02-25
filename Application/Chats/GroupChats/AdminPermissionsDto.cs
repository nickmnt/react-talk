namespace Application.Chats.GroupChats
{
    public class AdminPermissionsDto
    {
        public bool DeleteMessages { get; set; } = true;
        public bool BanUsers { get; set; } = true;
        public bool AddNewAdmins { get; set; } = true;
        public bool RemainAnonymous { get; set; } = true;
        public string CustomTitle { get; set; }
    }
}