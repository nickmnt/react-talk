using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class FixDatabaseAfterDirectChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_AspNetUsers_AppUserId",
                table: "Chats");

            migrationBuilder.DropForeignKey(
                name: "FK_Chats_PrivateChat_PrivateChatId",
                table: "Chats");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Chats",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Chats_AppUserId",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Chats");

            migrationBuilder.RenameTable(
                name: "Chats",
                newName: "Chat");

            migrationBuilder.RenameIndex(
                name: "IX_Chats_PrivateChatId",
                table: "Chat",
                newName: "IX_Chat_PrivateChatId");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Chat",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chat",
                table: "Chat",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "UserChats",
                columns: table => new
                {
                    ChatId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserChats", x => new { x.AppUserId, x.ChatId });
                    table.ForeignKey(
                        name: "FK_UserChats_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserChats_Chat_ChatId",
                        column: x => x.ChatId,
                        principalTable: "Chat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserChats_ChatId",
                table: "UserChats",
                column: "ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_PrivateChat_PrivateChatId",
                table: "Chat",
                column: "PrivateChatId",
                principalTable: "PrivateChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chat_PrivateChat_PrivateChatId",
                table: "Chat");

            migrationBuilder.DropTable(
                name: "UserChats");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Chat",
                table: "Chat");

            migrationBuilder.RenameTable(
                name: "Chat",
                newName: "Chats");

            migrationBuilder.RenameIndex(
                name: "IX_Chat_PrivateChatId",
                table: "Chats",
                newName: "IX_Chats_PrivateChatId");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Chats",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Chats",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chats",
                table: "Chats",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_AppUserId",
                table: "Chats",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_AspNetUsers_AppUserId",
                table: "Chats",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_PrivateChat_PrivateChatId",
                table: "Chats",
                column: "PrivateChatId",
                principalTable: "PrivateChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
