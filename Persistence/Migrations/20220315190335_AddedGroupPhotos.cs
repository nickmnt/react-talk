using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddedGroupPhotos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ChatId",
                table: "Photos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_ChatId",
                table: "Photos",
                column: "ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Chats_ChatId",
                table: "Photos",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Chats_ChatId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_ChatId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "Photos");
        }
    }
}
