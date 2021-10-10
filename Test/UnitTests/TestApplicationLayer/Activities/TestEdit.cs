using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using Test.Mocks;
using TestSupport.EfHelpers;
using Xunit;
using Xunit.Extensions.AssertExtensions;

namespace Test.UnitTests.TestApplicationLayer.Activities
{
    public class TestEdit
    {
        [Fact]
        public void EditUnknownActivity()
        {
            //Arrange
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                context.Database.EnsureCreated();
                var users = new List<AppUser>();
                Seed.SeedData(context, MockUserManager.Create(users).Object).Wait();
                
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();

                var request = new Edit.Command { Activity = new Activity {Id = Guid.NewGuid()} }; 
                var handler = new Edit.Handler(context, mapper);
                
                //Act
                var result = handler.Handle(request, new System.Threading.CancellationToken()).Result;
                
                //Assert
                result.ShouldBeNull();
            }
        }
        
        [Fact]
        public void EditNormalActivity()
        {
            //Arrange
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                context.Database.EnsureCreated();
                var users = new List<AppUser>();
                Seed.SeedData(context, MockUserManager.Create(users).Object).Wait();
                
                var testActivity = new Activity
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub",
                    Attendees = new List<ActivityAttendee>
                    {
                        new ActivityAttendee
                        {
                            AppUser = new AppUser
                            {
                                DisplayName = "Bob",
                                UserName = "bob",
                                Email = "bob@test.com"
                            },
                            IsHost = true
                        }
                    }
                };
                var addedActivity = context.Add(testActivity);

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();

                var request = new Edit.Command { Activity = new Activity {Id=addedActivity.Entity.Id} }; 
                var handler = new Edit.Handler(context, mapper);
                
                //Act
                var result = handler.Handle(request, new System.Threading.CancellationToken()).Result;
                
                //Assert
                result.ShouldNotBeNull();
                result.IsSuccess.ShouldBeTrue();
            }
        }
        
        [Fact]
        public async Task EditNullActivity()
        {
            //Arrange
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

                var request = new Edit.Command { Activity = null }; 
                var handler = new Edit.Handler(context, mapper);
                
                //Act, Assert
                await Assert.ThrowsAsync<NullReferenceException>(() => handler.Handle(request, new System.Threading.CancellationToken()));
            }
        }
    }
}