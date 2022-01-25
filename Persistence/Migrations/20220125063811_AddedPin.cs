using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddedPin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pin",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MessageId = table.Column<int>(type: "int", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    IsMutual = table.Column<bool>(type: "bit", nullable: false),
                    ChatId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pin", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pin_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pin_Chat_ChatId",
                        column: x => x.ChatId,
                        principalTable: "Chat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pin_Message_MessageId",
                        column: x => x.MessageId,
                        principalTable: "Message",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pin_AppUserId",
                table: "Pin",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Pin_ChatId",
                table: "Pin",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Pin_MessageId",
                table: "Pin",
                column: "MessageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pin");
        }
    }
}
