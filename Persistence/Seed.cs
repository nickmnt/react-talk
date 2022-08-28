using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;
using Domain.Direct;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com",
                        LastSeen = DateTime.UtcNow
                    },
                    new AppUser
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com",
                        LastSeen = DateTime.UtcNow
                    },
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com",
                        LastSeen = DateTime.UtcNow
                    },
                    new AppUser
                    {
                        DisplayName = "Guide",
                        UserName = "Friendly Guide",
                        Email = "supersecretguide@test.com",
                        LastSeen = DateTime.UtcNow
                    },
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
                var guide = users[3];
                var tutorialMessages = new List<Message>
                {
                    new Message
                    {
                        Type = MessageType.Text,
                        Body = "Welcome to ReactTalk!",
                        Sender = users[3]
                    },
                    new Message
                    {
                        Type = MessageType.Text,
                        Body = "Try playing with the three test accounts.\nTom, Bob, Jane\nAll have the same password: Pa$$w0rd",
                        Sender = users[3],
                    },
                    new Message
                    {
                        Type = MessageType.Text,
                        Body = "You can use the search option in the top-left section of the screen.\n" +
                               "Also, you can go to the details of any chat.\nThere, you can add a user to your contacts.",
                        Sender = users[3]
                    },
                    new Message
                    {
                        Type = MessageType.Text,
                        Body = "You can also create groups from the drawer on the left, or edit your profile using settings.\n",
                        Sender = users[3]
                    },
                    new Message
                    {
                        Type = MessageType.Text,
                        Body = "A variety of features have been implemented based on Telegram and Whatsapp. It would be impossible for me to highlight them all here, feel free to explore :-)\n",
                        Sender = users[3]
                    }
                };
                var i = 0;
                foreach (var message in tutorialMessages)
                {
                    Console.WriteLine(message.Body);
                    message.CreatedAt = DateTime.UtcNow.AddDays(-1).AddSeconds(i * 20);
                    i++;
                }
                var chat = new Chat
                {
                    Id = new Guid("15b5eeb5-5368-4022-a358-bd299ef61b0f"),
                    Type = ChatType.Group, Name = "Tutorial", Description = "A minimal tutorial for new members :-)", Messages = tutorialMessages,
                    SendMedia = false,
                    SendMessages = false,
                    Photos = new List<Photo>
                    {
                        new Photo {Id = "tutorialPhotoId",Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Wikibooks-help-icon.svg/2048px-Wikibooks-help-icon.svg.png", IsMain = true}
                    }
                };
                foreach (var user in users)
                {
                    var userChat = new UserChat { AppUser = user, Chat = chat, MembershipType = MemberType.Normal };
                    await context.UserChats.AddAsync(userChat);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
