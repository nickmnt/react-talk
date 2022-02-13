using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class BetterPermissionsAndChat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chat_ChannelChat_ChannelChatId",
                table: "Chat");

            migrationBuilder.DropForeignKey(
                name: "FK_Chat_GroupChat_GroupChatId",
                table: "Chat");

            migrationBuilder.DropForeignKey(
                name: "FK_Chat_PrivateChat_PrivateChatId",
                table: "Chat");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_ChannelChat_ChannelChatId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_GroupChat_GroupChatId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_PrivateChat_PrivateChatId",
                table: "Message");

            migrationBuilder.DropTable(
                name: "ChannelChat");

            migrationBuilder.DropTable(
                name: "GroupChat");

            migrationBuilder.DropTable(
                name: "PrivateChat");

            migrationBuilder.DropTable(
                name: "GroupMemberPermissions");

            migrationBuilder.DropIndex(
                name: "IX_Message_ChannelChatId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_GroupChatId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_PrivateChatId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Chat_ChannelChatId",
                table: "Chat");

            migrationBuilder.DropIndex(
                name: "IX_Chat_GroupChatId",
                table: "Chat");

            migrationBuilder.DropIndex(
                name: "IX_Chat_PrivateChatId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "ChannelChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "GroupChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "PrivateChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "ChannelChatId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "GroupChatId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "PrivateChatId",
                table: "Chat");

            migrationBuilder.AddColumn<bool>(
                name: "AddNewAdmins",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AddUsers",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BanUsers",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ChangeChatInfo",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DeleteMessages",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PinMessages",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RemainAnonymous",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SendMedia",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SendMessages",
                table: "UserChats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ChatId",
                table: "Message",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AddUsers",
                table: "Chat",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ChangeChatInfo",
                table: "Chat",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Chat",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Chat",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PinMessages",
                table: "Chat",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SendMedia",
                table: "Chat",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SendMessages",
                table: "Chat",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Message_ChatId",
                table: "Message",
                column: "ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Chat_ChatId",
                table: "Message",
                column: "ChatId",
                principalTable: "Chat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Chat_ChatId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_ChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "AddNewAdmins",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "AddUsers",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "BanUsers",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "ChangeChatInfo",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "DeleteMessages",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "PinMessages",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "RemainAnonymous",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "SendMedia",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "SendMessages",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "AddUsers",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "ChangeChatInfo",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "PinMessages",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "SendMedia",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "SendMessages",
                table: "Chat");

            migrationBuilder.AddColumn<int>(
                name: "ChannelChatId",
                table: "Message",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GroupChatId",
                table: "Message",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrivateChatId",
                table: "Message",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ChannelChatId",
                table: "Chat",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GroupChatId",
                table: "Chat",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrivateChatId",
                table: "Chat",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChannelChat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelChat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupMemberPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AddUsers = table.Column<bool>(type: "bit", nullable: false),
                    ChangeChatInfo = table.Column<bool>(type: "bit", nullable: false),
                    PinMessages = table.Column<bool>(type: "bit", nullable: false),
                    SendMedia = table.Column<bool>(type: "bit", nullable: false),
                    SendMessages = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMemberPermissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrivateChat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrivateChat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupChat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MemberPermissionsId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupChat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupChat_GroupMemberPermissions_MemberPermissionsId",
                        column: x => x.MemberPermissionsId,
                        principalTable: "GroupMemberPermissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Message_ChannelChatId",
                table: "Message",
                column: "ChannelChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_GroupChatId",
                table: "Message",
                column: "GroupChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_PrivateChatId",
                table: "Message",
                column: "PrivateChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_ChannelChatId",
                table: "Chat",
                column: "ChannelChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_GroupChatId",
                table: "Chat",
                column: "GroupChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_PrivateChatId",
                table: "Chat",
                column: "PrivateChatId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChat_MemberPermissionsId",
                table: "GroupChat",
                column: "MemberPermissionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_ChannelChat_ChannelChatId",
                table: "Chat",
                column: "ChannelChatId",
                principalTable: "ChannelChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_GroupChat_GroupChatId",
                table: "Chat",
                column: "GroupChatId",
                principalTable: "GroupChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_PrivateChat_PrivateChatId",
                table: "Chat",
                column: "PrivateChatId",
                principalTable: "PrivateChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_ChannelChat_ChannelChatId",
                table: "Message",
                column: "ChannelChatId",
                principalTable: "ChannelChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_GroupChat_GroupChatId",
                table: "Message",
                column: "GroupChatId",
                principalTable: "GroupChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_PrivateChat_PrivateChatId",
                table: "Message",
                column: "PrivateChatId",
                principalTable: "PrivateChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
