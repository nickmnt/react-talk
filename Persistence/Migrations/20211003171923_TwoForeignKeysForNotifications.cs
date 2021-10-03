using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class TwoForeignKeysForNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "JoinNotification",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "FollowNotification",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JoinNotification_OwnerId",
                table: "JoinNotification",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_FollowNotification_OwnerId",
                table: "FollowNotification",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_FollowNotification_AspNetUsers_OwnerId",
                table: "FollowNotification",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JoinNotification_AspNetUsers_OwnerId",
                table: "JoinNotification",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FollowNotification_AspNetUsers_OwnerId",
                table: "FollowNotification");

            migrationBuilder.DropForeignKey(
                name: "FK_JoinNotification_AspNetUsers_OwnerId",
                table: "JoinNotification");

            migrationBuilder.DropIndex(
                name: "IX_JoinNotification_OwnerId",
                table: "JoinNotification");

            migrationBuilder.DropIndex(
                name: "IX_FollowNotification_OwnerId",
                table: "FollowNotification");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "JoinNotification");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "FollowNotification");
        }
    }
}
