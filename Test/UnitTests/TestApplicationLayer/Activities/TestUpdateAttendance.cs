using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Test.Mocks;
using TestSupport.EfHelpers;
using Xunit;
using Xunit.Extensions.AssertExtensions;

namespace Test.UnitTests.TestApplicationLayer.Activities
{
    public class TestUpdateAttendance
    {
        [Fact]
        public async Task UpdateAttendanceUnknown()
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

                var request = new UpdateAttendance.Command { Id = Guid.NewGuid() }; 
                var handler = new UpdateAttendance.Handler(context, MockUserAccessor.Create().Object);
                
                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());
                
                //Assert
                result.ShouldBeNull();
            }
        }
        
        [Fact]
        public async Task UpdateAttendanceValid()
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

                var testActivity = new Activity
                {
                    Title = "Future Activity 6",
                    Date = DateTime.Now.AddMonths(6),
                    Description = "Activity 6 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "O2 Arena",
                    Attendees = new List<ActivityAttendee>
                    {
                        new ActivityAttendee
                        {
                            AppUser = users[2],
                            IsHost = true
                        },
                        new ActivityAttendee
                        {
                            AppUser = users[1],
                            IsHost = false
                        },
                    }
                };

                var testActivityId = context.Add(testActivity).Entity.Id;
                await context.SaveChangesAsync();

                var request = new UpdateAttendance.Command { Id = testActivityId }; 
                var handler = new UpdateAttendance.Handler(context, MockUserAccessor.Create().Object);
                
                //Act
                var result = await handler.Handle(request, new System.Threading.CancellationToken());
                
                //Assert
                result.ShouldNotBeNull();
                result.IsSuccess.ShouldBeTrue();
                result.Error.ShouldBeNull();
            }
        }
    }
}