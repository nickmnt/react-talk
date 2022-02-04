using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddedForwardedFrom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ForwardedFromId",
                table: "Message",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_ForwardedFromId",
                table: "Message",
                column: "ForwardedFromId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_AspNetUsers_ForwardedFromId",
                table: "Message",
                column: "ForwardedFromId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_AspNetUsers_ForwardedFromId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_ForwardedFromId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "ForwardedFromId",
                table: "Message");
        }
    }
}
