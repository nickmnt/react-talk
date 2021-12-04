using System.Collections.Generic;
using Domain.Direct;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; } = new List<ActivityAttendee>();
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<UserFollowing> Followings { get; set; } = new List<UserFollowing>();
        public ICollection<UserFollowing> Followers { get; set; } = new List<UserFollowing>();
        public ICollection<CommentNotification> CommentNotifications { get; set; } = new List<CommentNotification>();
        public ICollection<FollowNotification> FollowNotifications { get; set; } = new List<FollowNotification>();
        public ICollection<JoinNotification> JoinNotifications { get; set; } = new List<JoinNotification>();
        public ICollection<UserChat> Chats { get; set; } = new List<UserChat>();
        public ICollection<ChannelMembership> Channels { get; set; } = new List<ChannelMembership>();
        public ICollection<GroupMembership> Groups { get; set; } = new List<GroupMembership>();
    }
}