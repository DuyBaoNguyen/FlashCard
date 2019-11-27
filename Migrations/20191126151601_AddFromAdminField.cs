using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddFromAdminField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromAdmin",
                table: "Deck",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "FromAdmin",
                table: "Back",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromAdmin",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "FromAdmin",
                table: "Back");
        }
    }
}
