using System;
using System.Collections.Generic;
using System.Linq;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using TestSupport.EfHelpers;
using Xunit;
using Xunit.Extensions.AssertExtensions;

namespace Test.UnitTests.TestDataLayer
{
    public class TestDatabase
    {
        private Activity AddTestActivity(DbContext context)
        {
            var testActivity = new Activity
            {
                Title = "Past Activity 1",
                Date = DateTime.Now.AddMonths(-2),
                Description = "Activity 2 months ago",
                Category = "drinks",
                City = "London",
                Venue = "Pub",
                Attendees = new List<ActivityAttendee>()
            };
            context.Add(testActivity);
            return testActivity;
        }
        
        private Activity AddTestActivityWithAttendee(DbContext context)
        {
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
            context.Add(testActivity);
            return testActivity;
        }
        
        [Fact]
        public void TestActivityReadBackOk()
        {
            //SETUP
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                context.Database.EnsureCreated();
                AddTestActivity(context);
                context.SaveChanges();

                //ATTEMPT
                var person = context.Activities.First();

                //VERIFY
                person.Category.ShouldEqual("drinks");
            }
        }
        
        [Fact]
        public void TestActivityAttendeeReadBackOk()
        {
            //SETUP
            var options = SqliteInMemory.CreateOptions<DataContext>();
            using (var context = new DataContext(options))
            {
                context.Database.EnsureCreated();
                var activity = AddTestActivityWithAttendee(context);
                context.SaveChanges();

                //ATTEMPT
                var person = context.Activities.First();

                //VERIFY
                person.Attendees.ToList()[0].AppUser.DisplayName.ShouldEqual("Bob");
                person.Attendees.ToList()[0].IsHost.ShouldEqual(true);
                person.Attendees.ToList()[0].Activity.ShouldEqual(activity);
            }
        }
    }
}