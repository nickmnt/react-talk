using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Chats.ChannelChats;
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
    public class TestAddChannel
    {
        [Fact]
        public async Task TestFlawless()
        {
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                var request = new Create.Command { Name = "channel", Description = "optional" };
                var userAccessor = MockUserAccessor.Create().Object;
                var config = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfiles()); });
                var mapper = config.CreateMapper();
                var handler = new Create.Handler(context, mapper, userAccessor);

                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());

                var bobChat = await context.UserChats
                    .Include(x => x.Chat)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.AppUser.UserName == userAccessor.GetUsername());

                //Assert
                result.Value.ShouldNotBeNull();
                bobChat.ShouldNotBeNull();
                Assert.Equal(result.Value.Id.ToString(), bobChat.Chat.Id.ToString());
            }
        }
    }
}