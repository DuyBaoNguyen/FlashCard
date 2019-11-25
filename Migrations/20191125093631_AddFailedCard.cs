using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddFailedCard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Test",
                table: "Test");

            migrationBuilder.DropColumn(
                name: "FailedCards",
                table: "Test");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Test",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<float>(
                name: "Score",
                table: "Test",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Test",
                table: "Test",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "FailedCard",
                columns: table => new
                {
                    TestId = table.Column<int>(nullable: false),
                    CardId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FailedCard", x => new { x.CardId, x.TestId });
                    table.ForeignKey(
                        name: "FK_FailedCard_Card_CardId",
                        column: x => x.CardId,
                        principalTable: "Card",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FailedCard_Test_TestId",
                        column: x => x.TestId,
                        principalTable: "Test",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Test_DeckId",
                table: "Test",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_FailedCard_TestId",
                table: "FailedCard",
                column: "TestId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FailedCard");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Test",
                table: "Test");

            migrationBuilder.DropIndex(
                name: "IX_Test_DeckId",
                table: "Test");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Test");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "Test");

            migrationBuilder.AddColumn<int>(
                name: "FailedCards",
                table: "Test",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Test",
                table: "Test",
                columns: new[] { "DeckId", "DateTime" });
        }
    }
}
