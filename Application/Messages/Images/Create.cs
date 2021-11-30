﻿using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Direct;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages.Images
{
    public class Create
    {
        public class Command : IRequest<Result<MessageDto>>
        {
            public IFormFile File { get; set; }
            public string Body { get; set; }
            public Guid ChatId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<MessageDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<MessageDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                //MB = 1024*1024 Bytes =1,048,576 Bytes, 50 MB = 52,428,800 
                if(request.File.Length > 52_428_800)
                    return Result<MessageDto>.Failure("File size is larger than 50 Megabytes.");
                
                var userChat = await _context
                    .UserChats
                    .Include(x => x.AppUser)
                    .Include(x => x.Chat)
                    .Include(x => x.Chat.PrivateChat)
                    .SingleOrDefaultAsync(x => x.ChatId == request.ChatId && 
                                               x.AppUser.UserName == _userAccessor.GetUsername(), cancellationToken);

                if (userChat == null)
                    return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var message = new Message
                {
                    Type = MessageType.Image,
                    Sender = userChat.AppUser,
                    Body = request.Body,
                    Url = photoUploadResult.Url,
                    PublicId = photoUploadResult.PublicId
                };
                
                userChat.Chat.PrivateChat.Messages.Add(message);

                var result = await _context.SaveChangesAsync() > 0;

                if (result)
                    return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message));
                else
                    return Result<MessageDto>.Failure("Failed to add the message to the private chat");
            }
        }
    }
}