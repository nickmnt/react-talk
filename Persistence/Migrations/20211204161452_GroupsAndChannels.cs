using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class GroupsAndChannels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Chat",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

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

            migrationBuilder.CreateTable(
                name: "ChannelChat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelChat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupChat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupChat", x => x.Id);
                });

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
                name: "IX_Message_ChannelChatId",
                table: "Message",
                column: "ChannelChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_GroupChatId",
                table: "Message",
                column: "GroupChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_ChannelChatId",
                table: "Chat",
                column: "ChannelChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_GroupChatId",
                table: "Chat",
                column: "GroupChatId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembership_ChannelId",
                table: "ChannelMembership",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupMembership_GroupId",
                table: "GroupMembership",
                column: "GroupId");

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chat_ChannelChat_ChannelChatId",
                table: "Chat");

            migrationBuilder.DropForeignKey(
                name: "FK_Chat_GroupChat_GroupChatId",
                table: "Chat");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_ChannelChat_ChannelChatId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_GroupChat_GroupChatId",
                table: "Message");

            migrationBuilder.DropTable(
                name: "ChannelMembership");

            migrationBuilder.DropTable(
                name: "GroupMembership");

            migrationBuilder.DropTable(
                name: "ChannelChat");

            migrationBuilder.DropTable(
                name: "GroupChat");

            migrationBuilder.DropIndex(
                name: "IX_Message_ChannelChatId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_GroupChatId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Chat_ChannelChatId",
                table: "Chat");

            migrationBuilder.DropIndex(
                name: "IX_Chat_GroupChatId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "ChannelChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "GroupChatId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "ChannelChatId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "GroupChatId",
                table: "Chat");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Chat",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
