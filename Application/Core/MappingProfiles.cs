using System.Linq;
using Application.Activities;
using Application.Chats;
using Application.Chats.PrivateChats;
using Application.Comments;
using Application.Messages;
using Application.Notifications;
using Application.Profiles;
using Application.Search;
using Application.SearchChats;
using Domain;
using Domain.Direct;
using Profile = AutoMapper.Profile;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername,
                    o => 
                        o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.Following,
                    o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following,
                    o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<ActivityAttendee, UserActivityDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Activity.Category))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.AppUser.UserName));
            CreateMap<AppUser, SearchResult>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<AppUser, SearchChatDto>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<AppUser, NotificationsDto>()
                .ForMember(d => d.CommentNotifications, o => o.MapFrom(s => s.CommentNotifications))
                .ForMember(d => d.FollowNotifications, o => o.MapFrom(s => s.FollowNotifications))
                .ForMember(d => d.JoinNotifications, o => o.MapFrom(s => s.JoinNotifications));
            CreateMap<CommentNotification, CommentNotifDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Comment.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Comment.Author.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.ActivityId, o => o.MapFrom(s => s.Comment.Activity.Id))
                .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.Comment.CreatedAt));
            CreateMap<FollowNotification, FollowNotifDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Follower.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Follower.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.Following,
                    o => o.MapFrom(s => s.Follower.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<JoinNotification, JoinNotifDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.User.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.ActivityId, o => o.MapFrom(s => s.Activity.Id));
            CreateMap<UserChat, ChatDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Chat.Id))
                .ForMember(d => d.Type, o => o.MapFrom(s => s.Chat.Type))
                .ForMember(d => d.PrivateChatId, o => o.MapFrom(s => s.Chat.Type == ChatType.PrivateChat ? s.Chat.PrivateChat.Id : -1))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Chat.Type == ChatType.PrivateChat ? s.Chat.Users.First(x => x.AppUser.UserName != s.AppUser.UserName).AppUser.DisplayName: null))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Chat.Type == ChatType.PrivateChat ? s.Chat.Users.First(x => x.AppUser.UserName != s.AppUser.UserName).AppUser.Photos.FirstOrDefault(x => x.IsMain).Url : null))
                .ForMember(d => d.ParticipantUsername, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Pins, o => o.MapFrom(s => s.Chat.Pins.Where(x => x.IsMutual || x.AppUserId == s.AppUserId)));
            CreateMap<Message, MessageDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Sender.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Sender.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.ForwardUsername, o => o.MapFrom(s => s.ForwardedFrom.UserName))
                .ForMember(d => d.ForwardDisplayName, o => o.MapFrom(s => s.ForwardedFrom.DisplayName));
            CreateMap<PrivateChat, PrivateChatDto>();
            CreateMap<ChannelChat, ChannelDetailsDto>();
            CreateMap<GroupChat, GroupDetailsDto>();
            CreateMap<UserChat, GroupMember>()
                .ForMember(d => d.MemberType, o => o.MapFrom(s => s.MembershipType))
                .ForMember(d => d.LastSeen, o => o.MapFrom(s => s.LastSeen))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.ChatId, o => o.MapFrom(s => s.ChatId));
            CreateMap<UserChat, ChannelMember>()
                .ForMember(d => d.MemberType, o => o.MapFrom(s => s.MembershipType))
                .ForMember(d => d.LastSeen, o => o.MapFrom(s => s.LastSeen))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.ChatId, o => o.MapFrom(s => s.ChatId));
            CreateMap<Pin, PinDto>();
        }
    }
}