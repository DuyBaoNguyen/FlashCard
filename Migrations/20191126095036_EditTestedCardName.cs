using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class EditTestedCardName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestedCards_Card_CardId",
                table: "TestedCards");

            migrationBuilder.DropForeignKey(
                name: "FK_TestedCards_Test_TestId",
                table: "TestedCards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TestedCards",
                table: "TestedCards");

            migrationBuilder.RenameTable(
                name: "TestedCards",
                newName: "TestedCard");

            migrationBuilder.RenameIndex(
                name: "IX_TestedCards_TestId",
                table: "TestedCard",
                newName: "IX_TestedCard_TestId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestedCard",
                table: "TestedCard",
                columns: new[] { "CardId", "TestId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TestedCard_Card_CardId",
                table: "TestedCard",
                column: "CardId",
                principalTable: "Card",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestedCard_Test_TestId",
                table: "TestedCard",
                column: "TestId",
                principalTable: "Test",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestedCard_Card_CardId",
                table: "TestedCard");

            migrationBuilder.DropForeignKey(
                name: "FK_TestedCard_Test_TestId",
                table: "TestedCard");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TestedCard",
                table: "TestedCard");

            migrationBuilder.RenameTable(
                name: "TestedCard",
                newName: "TestedCards");

            migrationBuilder.RenameIndex(
                name: "IX_TestedCard_TestId",
                table: "TestedCards",
                newName: "IX_TestedCards_TestId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestedCards",
                table: "TestedCards",
                columns: new[] { "CardId", "TestId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TestedCards_Card_CardId",
                table: "TestedCards",
                column: "CardId",
                principalTable: "Card",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestedCards_Test_TestId",
                table: "TestedCards",
                column: "TestId",
                principalTable: "Test",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
