using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Chats.ChannelChats;
using Application.Core;
using AutoMapper;
using Domain;
using Domain.Direct;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Test.Mocks;
using TestSupport.EfHelpers;
using Xunit;
using Xunit.Extensions.AssertExtensions;

namespace Test.UnitTests.TestApplicationLayer.Chats
{
    public class TestChannelDetails
    {
        [Fact]
        public async Task TestNonChannel()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var chat = new Chat { Type = ChatType.PrivateChat };
                
                var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == "bob");
                var tom = await context.Users.FirstOrDefaultAsync(x => x.UserName == "tom");
                
                var userChat = new UserChat { Chat = chat, AppUser = user };
                var userChat1 = new UserChat { Chat = chat, AppUser = tom };

                var dbUserChat = context.UserChats.Add(userChat);
                context.UserChats.Add(userChat1);
                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();
                var userAccessor = MockUserAccessor.Create().Object;
                
                var request = new Details.Query { ChatId = dbUserChat.Entity.ChatId };
                var handler = new Details.Handler(context, mapper, userAccessor);

                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                //Assert
                result.ShouldNotBeNull();
                result.IsSuccess.ShouldBeFalse();
            }
        }
        
        [Fact]
        public async Task TestInvalid()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var bob = await context.Users.FirstAsync(x => x.UserName == "bob");
                var chat = new Chat { Type = ChatType.Channel };
                var userChat = new UserChat { AppUser = bob, Chat = chat, MembershipType = MemberType.Owner};
                var dbChat = context.Add(userChat);

                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();
                var userAccessor = MockUserAccessor.Create().Object;
                
                var request = new Details.Query { ChatId = new Guid() };
                var handler = new Details.Handler(context, mapper, userAccessor);

                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                //Assert
                result.ShouldBeNull();
            }
        }
        
        [Fact]
        public async Task TestFlawless()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var bob = await context.Users.FirstAsync(x => x.UserName == "bob");
                var chat = new Chat { Type = ChatType.Channel, Description = "HelloTest1"};
                var userChat = new UserChat { AppUser = bob, Chat = chat, MembershipType = MemberType.Owner};
                var dbChat = context.Add(userChat);

                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();
                var userAccessor = MockUserAccessor.Create().Object;
                
                var request = new Details.Query { ChatId = dbChat.Entity.ChatId };
                var handler = new Details.Handler(context, mapper, userAccessor);

                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                //Assert
                result.Value.ShouldNotBeNull();
            }
        }
    }
}