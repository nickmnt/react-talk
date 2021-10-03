﻿using System.Linq;
using Application.Activities;
using Application.Comments;
using Application.Notifications;
using Application.Profiles;
using Application.Search;
using Domain;
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
            CreateMap<AppUser, SearchResult>();
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
        }
    }
}