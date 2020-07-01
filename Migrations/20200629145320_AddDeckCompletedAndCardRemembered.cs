using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddDeckCompletedAndCardRemembered : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Completed",
                table: "Deck",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastPracticedDate",
                table: "Card",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Remembered",
                table: "Card",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Completed",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "LastPracticedDate",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "Remembered",
                table: "Card");
        }
    }
}
