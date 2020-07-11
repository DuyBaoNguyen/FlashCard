using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddFirstRememberedDateField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FirstRememberedDate",
                table: "SharedCard",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FirstRememberedDate",
                table: "Card",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstRememberedDate",
                table: "SharedCard");

            migrationBuilder.DropColumn(
                name: "FirstRememberedDate",
                table: "Card");
        }
    }
}
