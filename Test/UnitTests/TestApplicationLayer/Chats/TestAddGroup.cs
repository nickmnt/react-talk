using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Chats.GroupChats;
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
    public class TestAddGroup
    {
        // [Fact]
        // public async Task TestEmptyName()
        // {
        //     var options = SqliteInMemory.CreateOptions<DataContext>();
        //     using (var context = new DataContext(options))
        //     {
        //         await context.Database.EnsureCreatedAsync();
        //         var users = new List<AppUser>();
        //         await Seed.SeedData(context, MockUserManager.Create(users).Object);
        //
        //         var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
        //         var mapper = config.CreateMapper();
        //
        //         var request = new Create.Command { Name = "", Members = new List<string> { "tom" } };
        //         var userAccessor = MockUserAccessor.Create().Object;
        //         var handler = new Create.Handler(context, mapper, userAccessor);
        //
        //         //Act
        //         var result = await handler.Handle(request, new System.Threading.CancellationToken());
        //
        //         var tomChat = await context.UserChats
        //             .Include(x => x.Chat)
        //             .AsNoTracking().FirstOrDefaultAsync(x => x.AppUser.UserName == "tom");
        //         var bobChat = await context.UserChats
        //             .Include(x => x.Chat)
        //             .AsNoTracking()
        //             .FirstOrDefaultAsync(x => x.AppUser.UserName == userAccessor.GetUsername());
        //
        //         //Assert
        //         result.ShouldBeNull();
        //         tomChat.ShouldBeNull();
        //         bobChat.ShouldBeNull();
        //     }
        // }
        //
        // [Fact]
        // public async Task TestEmptyMembers()
        // {
        //     var options = SqliteInMemory.CreateOptions<DataContext>();
        //     using (var context = new DataContext(options))
        //     {
        //         await context.Database.EnsureCreatedAsync();
        //         var users = new List<AppUser>();
        //         await Seed.SeedData(context, MockUserManager.Create(users).Object);
        //
        //         var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
        //         var mapper = config.CreateMapper();
        //
        //         var request = new Create.Command { Name = "group", Members = new List<string> {} };
        //         var userAccessor = MockUserAccessor.Create().Object;
        //         var handler = new Create.Handler(context, mapper, userAccessor);
        //
        //         //Act
        //         var result = await handler.Handle(request, new System.Threading.CancellationToken());
        //
        //         var tomChat = await context.UserChats
        //             .Include(x => x.Chat)
        //             .AsNoTracking().FirstOrDefaultAsync(x => x.AppUser.UserName == "tom");
        //         var bobChat = await context.UserChats
        //             .Include(x => x.Chat)
        //             .AsNoTracking()
        //             .FirstOrDefaultAsync(x => x.AppUser.UserName == userAccessor.GetUsername());
        //
        //         //Assert
        //         result.ShouldBeNull();
        //         tomChat.ShouldBeNull();
        //         bobChat.ShouldBeNull();
        //     }
        // }

        [Fact]
        public async Task TestFakeMembers()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();

                var request = new Create.Command { Name = "group", Members = new List<string> {"tom", "kfkf"} };
                var userAccessor = MockUserAccessor.Create().Object;
                var handler = new Create.Handler(context, mapper, userAccessor);

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
                result.Value.ShouldNotBeNull();
                tomChat.ShouldNotBeNull();
                bobChat.ShouldNotBeNull();
                Assert.Equal(result.Value.Id.ToString(), bobChat.Chat.Id.ToString());
                Assert.Equal(result.Value.Id.ToString(), tomChat.Chat.Id.ToString());
            }
        }
        
        [Fact]
        public async Task TestOnlyFakeMembers()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();

                var request = new Create.Command { Name = "group", Members = new List<string> {"kfkf", "kfkf", "kpkp"} };
                var userAccessor = MockUserAccessor.Create().Object;
                var handler = new Create.Handler(context, mapper, userAccessor);

                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                var bobChat = await context.UserChats
                    .Include(x => x.Chat)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.AppUser.UserName == userAccessor.GetUsername());

                //Assert
                result.IsSuccess.ShouldBeFalse();
                result.Value.ShouldBeNull();
                bobChat.ShouldBeNull();
            }
        }

        [Fact]
        public async Task TestManyMembers()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();

                var request = new Create.Command { Name = "group", Members = new List<string> {"tom", "tom"} };
                var userAccessor = MockUserAccessor.Create().Object;
                var handler = new Create.Handler(context, mapper, userAccessor);

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
                result.Value.ShouldNotBeNull();
                tomChat.ShouldNotBeNull();
                bobChat.ShouldNotBeNull();
                Assert.Equal(result.Value.Id.ToString(), bobChat.Chat.Id.ToString());
                Assert.Equal(result.Value.Id.ToString(), tomChat.Chat.Id.ToString());
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

                    var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                    var mapper = config.CreateMapper();

                    var request = new Create.Command { Name = "group", Members = new List<string> {"tom"}};
                    var userAccessor = MockUserAccessor.Create().Object;
                    var handler = new Create.Handler(context, mapper, userAccessor);

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
                    result.Value.ShouldNotBeNull();
                    tomChat.ShouldNotBeNull();
                    bobChat.ShouldNotBeNull();
                    Assert.Equal(result.Value.Id.ToString(), bobChat.Chat.Id.ToString());
                    Assert.Equal(result.Value.Id.ToString(), tomChat.Chat.Id.ToString());
                }
            }
        }
}