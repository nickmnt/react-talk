using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class MembershipChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChannelMembership");

            migrationBuilder.DropTable(
                name: "GroupMembership");

            migrationBuilder.AddColumn<int>(
                name: "MembershipType",
                table: "UserChats",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MembershipType",
                table: "UserChats");

            migrationBuilder.CreateTable(
                name: "ChannelMembership",
                columns: table => new
                {
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ChannelId = table.Column<int>(type: "int", nullable: false),
                    MemberType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelMembership", x => new { x.AppUserId, x.ChannelId });
                    table.ForeignKey(
                        name: "FK_ChannelMembership_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChannelMembership_ChannelChat_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "ChannelChat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupMembership",
                columns: table => new
                {
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    GroupId = table.Column<int>(type: "int", nullable: false),
                    MemberType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMembership", x => new { x.AppUserId, x.GroupId });
                    table.ForeignKey(
                        name: "FK_GroupMembership_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupMembership_GroupChat_GroupId",
                        column: x => x.GroupId,
                        principalTable: "GroupChat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembership_ChannelId",
                table: "ChannelMembership",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupMembership_GroupId",
                table: "GroupMembership",
                column: "GroupId");
        }
    }
}
