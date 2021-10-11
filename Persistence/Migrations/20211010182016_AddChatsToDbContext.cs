using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddChatsToDbContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chat_AspNetUsers_AppUserId",
                table: "Chat");

            migrationBuilder.DropForeignKey(
                name: "FK_Chat_PrivateChat_PrivateChatId",
                table: "Chat");

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

            migrationBuilder.RenameIndex(
                name: "IX_Chat_AppUserId",
                table: "Chats",
                newName: "IX_Chats_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chats",
                table: "Chats",
                column: "Id");

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameTable(
                name: "Chats",
                newName: "Chat");

            migrationBuilder.RenameIndex(
                name: "IX_Chats_PrivateChatId",
                table: "Chat",
                newName: "IX_Chat_PrivateChatId");

            migrationBuilder.RenameIndex(
                name: "IX_Chats_AppUserId",
                table: "Chat",
                newName: "IX_Chat_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chat",
                table: "Chat",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_AspNetUsers_AppUserId",
                table: "Chat",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_PrivateChat_PrivateChatId",
                table: "Chat",
                column: "PrivateChatId",
                principalTable: "PrivateChat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
