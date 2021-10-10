using Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace Test.Mocks
{
    public class MockUserAccessor
    {
        public static Mock<IUserAccessor> Create()
        {
            var accessor = new Mock<IUserAccessor>();
            accessor.Setup(x => x.GetUsername()).Returns("bob");
            return accessor;
        }
    }
}