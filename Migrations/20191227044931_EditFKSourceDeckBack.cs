using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class EditFKSourceDeckBack : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Back_Back_SourceId",
                table: "Back");

            migrationBuilder.DropForeignKey(
                name: "FK_Deck_Deck_SourceId",
                table: "Deck");

            migrationBuilder.DropIndex(
                name: "IX_Deck_SourceId",
                table: "Deck");

            migrationBuilder.DropIndex(
                name: "IX_Back_SourceId",
                table: "Back");

            migrationBuilder.CreateIndex(
                name: "IX_Deck_SourceId",
                table: "Deck",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Back_SourceId",
                table: "Back",
                column: "SourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Back_Back_SourceId",
                table: "Back",
                column: "SourceId",
                principalTable: "Back",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deck_Deck_SourceId",
                table: "Deck",
                column: "SourceId",
                principalTable: "Deck",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Back_Back_SourceId",
                table: "Back");

            migrationBuilder.DropForeignKey(
                name: "FK_Deck_Deck_SourceId",
                table: "Deck");

            migrationBuilder.DropIndex(
                name: "IX_Deck_SourceId",
                table: "Deck");

            migrationBuilder.DropIndex(
                name: "IX_Back_SourceId",
                table: "Back");

            migrationBuilder.CreateIndex(
                name: "IX_Deck_SourceId",
                table: "Deck",
                column: "SourceId",
                unique: true,
                filter: "[SourceId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Back_SourceId",
                table: "Back",
                column: "SourceId",
                unique: true,
                filter: "[SourceId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Back_Back_SourceId",
                table: "Back",
                column: "SourceId",
                principalTable: "Back",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Deck_Deck_SourceId",
                table: "Deck",
                column: "SourceId",
                principalTable: "Deck",
                principalColumn: "Id");
        }
    }
}
