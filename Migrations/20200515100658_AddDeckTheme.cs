using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddDeckTheme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Theme",
                table: "Deck",
                maxLength: 7,
                nullable: false,
                defaultValue: "#ffffff");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Theme",
                table: "Deck");
        }
    }
}
