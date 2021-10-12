using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Chats;
using Application.Core;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Test.Mocks;
using TestSupport.EfHelpers;
using Xunit;
using Xunit.Extensions.AssertExtensions;

namespace Test.UnitTests.TestApplicationLayer.Chats
{
    public class TestAddPrivateChat
    {
        [Fact]
        public async Task TestAddOkay()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();

                var request = new AddPrivateChat.Command { TargetUsername = "tom" };

                var userAccessor = MockUserAccessor.Create().Object;
                var handler = new AddPrivateChat.Handler(context, mapper, userAccessor);
                
                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                var tomChat = await context.UserChats
                    .Include(x => x.Chat)
                    .AsNoTracking().FirstOrDefaultAsync(x => x.AppUser.UserName == "tom");
                var bobChat = await context.UserChats
                    .Include(x => x.Chat)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.AppUser.UserName == userAccessor.GetUsername());
                //Assert
                result.ShouldNotBeNull();
                tomChat.ShouldNotBeNull();
                bobChat.ShouldNotBeNull();
                Assert.Equal(result.Value.Id,bobChat.Chat.Id.ToString());
                Assert.Equal(result.Value.Id,tomChat.Chat.Id.ToString());
            }
        }
        
        [Fact]
        public async Task TestAddUnknownUsername()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();

                var request = new AddPrivateChat.Command { TargetUsername = "tamtam" };

                var userAccessor = MockUserAccessor.Create().Object;
                var handler = new AddPrivateChat.Handler(context, mapper, userAccessor);
                
                var userChatCount = await context.UserChats.CountAsync();
                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                var userChatCountAfter = await context.UserChats.CountAsync();
                
                //Assert
                result.ShouldBeNull();
                userChatCount.ShouldEqual(userChatCountAfter);
            }
        }
        
        [Fact]
        public async Task TestAddNullUsername()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();

                var request = new AddPrivateChat.Command { TargetUsername = null };

                var userAccessor = MockUserAccessor.Create().Object;
                var handler = new AddPrivateChat.Handler(context, mapper, userAccessor);
                
                var userChatCount = await context.UserChats.CountAsync();
                
                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                var userChatCountAfter = await context.UserChats.CountAsync();
                //Assert
                result.ShouldBeNull();
                userChatCount.ShouldEqual(userChatCountAfter);
            }
        }
    }
}