

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Search;
using AutoMapper;
using Domain;
using Persistence;
using Test.Mocks;
using TestSupport.EfHelpers;
using Xunit;
using Xunit.Extensions.AssertExtensions;

namespace Test.UnitTests.TestApplicationLayer.Search
{
    public class TestList
    {
        [Fact]
        public async Task TestFirstPartInTerm()
        {
            //Arrange
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();
                var userAccessor = MockUserAccessor.Create().Object;
                
                var request = new List.Query {Term = "t"}; 
                var handler = new List.Handler(userAccessor, context, mapper);
                
                //Act
                var result = await handler.Handle(request, new CancellationToken());
                
                //Assert
                result.IsSuccess.ShouldBeTrue();
                result.Error.ShouldBeNull();
                result.Value.Any(x => x.Username == "tom").ShouldBeTrue();
            }
        }
        
        [Fact]
        public async Task TestMiddlePartInTerm()
        {
            //Arrange
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();
                var userAccessor = MockUserAccessor.Create().Object;
                
                var request = new List.Query {Term = "t"}; 
                var handler = new List.Handler(userAccessor, context, mapper);
                
                //Act
                var result = await handler.Handle(request, new CancellationToken());
                
                //Assert
                result.IsSuccess.ShouldBeTrue();
                result.Error.ShouldBeNull();
                result.Value.Any(x => x.Username == "tom").ShouldBeTrue();
            }
        }
        
        [Fact]
        public async Task TestEndPartInTerm()
        {
            //Arrange
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                await context.Database.EnsureCreatedAsync();
                var users = new List<AppUser>();
                await Seed.SeedData(context, MockUserManager.Create(users).Object);

                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();
                var userAccessor = MockUserAccessor.Create().Object;
                
                var request = new List.Query {Term = "m"}; 
                var handler = new List.Handler(userAccessor,context, mapper);
                
                //Act
                var result = await handler.Handle(request, new CancellationToken());
                
                //Assert
                result.IsSuccess.ShouldBeTrue();
                result.Error.ShouldBeNull();
                result.Value.Any(x => x.Username == "tom").ShouldBeTrue();
            }
        }
    }
}