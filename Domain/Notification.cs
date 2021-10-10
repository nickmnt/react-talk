using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Notification
    {
        public int Id { get; set; }
        [Required]
        public string Type { get; set; }
        public CommentNotification CommentNotification { get; set; }
        public FollowNotification FollowNotification { get; set; }
        public JoinNotification JoinNotification { get; set; }
    }
}