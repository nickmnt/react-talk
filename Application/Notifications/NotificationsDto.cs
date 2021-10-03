using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Notifications
{
    public class NotificationsDto
    {
        public ICollection<JoinNotifDto> JoinNotifications { get; set; }
        public ICollection<FollowNotifDto> FollowNotifications { get; set; }
        public ICollection<CommentNotifDto> CommentNotifications { get; set; }
        [JsonIgnore] public string Username { get; set; }
    }
}