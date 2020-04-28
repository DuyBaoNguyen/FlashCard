using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddTestTaker : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TakerId",
                table: "Test",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TakerId",
                table: "Match",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Test_TakerId",
                table: "Test",
                column: "TakerId");

            migrationBuilder.CreateIndex(
                name: "IX_Match_TakerId",
                table: "Match",
                column: "TakerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Match_User_TakerId",
                table: "Match",
                column: "TakerId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Test_User_TakerId",
                table: "Test",
                column: "TakerId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Match_User_TakerId",
                table: "Match");

            migrationBuilder.DropForeignKey(
                name: "FK_Test_User_TakerId",
                table: "Test");

            migrationBuilder.DropIndex(
                name: "IX_Test_TakerId",
                table: "Test");

            migrationBuilder.DropIndex(
                name: "IX_Match_TakerId",
                table: "Match");

            migrationBuilder.DropColumn(
                name: "TakerId",
                table: "Test");

            migrationBuilder.DropColumn(
                name: "TakerId",
                table: "Match");
        }
    }
}
