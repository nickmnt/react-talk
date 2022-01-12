using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddedGroupMemberPermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MemberPermissionsId",
                table: "GroupChat",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GroupMemberPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SendMessages = table.Column<bool>(type: "bit", nullable: false),
                    SendMedia = table.Column<bool>(type: "bit", nullable: false),
                    AddUsers = table.Column<bool>(type: "bit", nullable: false),
                    PinMessages = table.Column<bool>(type: "bit", nullable: false),
                    ChangeChatInfo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMemberPermissions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupChat_MemberPermissionsId",
                table: "GroupChat",
                column: "MemberPermissionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChat_GroupMemberPermissions_MemberPermissionsId",
                table: "GroupChat",
                column: "MemberPermissionsId",
                principalTable: "GroupMemberPermissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChat_GroupMemberPermissions_MemberPermissionsId",
                table: "GroupChat");

            migrationBuilder.DropTable(
                name: "GroupMemberPermissions");

            migrationBuilder.DropIndex(
                name: "IX_GroupChat_MemberPermissionsId",
                table: "GroupChat");

            migrationBuilder.DropColumn(
                name: "MemberPermissionsId",
                table: "GroupChat");
        }
    }
}
