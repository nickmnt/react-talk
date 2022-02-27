using Domain;
using Domain.Direct;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }
        public DbSet<UserChat> UserChats { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ActivityId}));

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.AppUserId);
            
            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(deleteBehavior: DeleteBehavior.Restrict);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(deleteBehavior: DeleteBehavior.Restrict);
                
                
            });

            builder.Entity<JoinNotification>()
                .HasOne(x => x.Owner)
                .WithMany(x => x.JoinNotifications)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<FollowNotification>()
                .HasOne(x => x.Owner)
                .WithMany(x => x.FollowNotifications)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<UserChat>(x => x.HasKey(aa => new {aa.AppUserId, aa.ChatId}));

            builder.Entity<UserChat>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Chats)
                .HasForeignKey(aa => aa.AppUserId);
            
            builder.Entity<UserChat>()
                .HasOne(u => u.Chat)
                .WithMany(a => a.Users)
                .HasForeignKey(aa => aa.ChatId);
        }
    }
}