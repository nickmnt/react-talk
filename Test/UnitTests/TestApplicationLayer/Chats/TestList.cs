﻿using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Chats;
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
    public class TestList
    {
        [Fact]
        public async Task TestEmptyChats()
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

                var request = new List.Query{Params = new PagingParams()}; 
                var handler = new List.Handler(context, mapper, MockUserAccessor.Create().Object);
                
                //Act
                var result = await handler.Handle(request, new CancellationToken());
                
                //Assert
                result.IsSuccess.ShouldBeTrue();
                result.Error.ShouldBeNull();
                result.Value.Count.ShouldEqual(0);
            }
        }
        
        [Fact]
        public async Task TestNonEmptyChats()
        {
            //Arrange
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
                context.UserChats.Add(userChat);
                context.UserChats.Add(userChat1);
                await context.SaveChangesAsync();
                
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new MappingProfiles());
                });
                var mapper = config.CreateMapper();

                var request = new List.Query{Params = new PagingParams()}; 
                var handler = new List.Handler(context, mapper, MockUserAccessor.Create().Object);
                
                //Act
                var result = await handler.Handle(request, new CancellationToken());
                
                //Assert
                result.IsSuccess.ShouldBeTrue();
                result.Error.ShouldBeNull();
                result.Value.Count.ShouldEqual(1);
            }
        }
    }
}