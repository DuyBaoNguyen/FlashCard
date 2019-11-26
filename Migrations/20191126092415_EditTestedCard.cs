using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class EditTestedCard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FailedCard");

            migrationBuilder.DropTable(
                name: "SuccessCard");

            migrationBuilder.CreateTable(
                name: "TestedCards",
                columns: table => new
                {
                    TestId = table.Column<int>(nullable: false),
                    CardId = table.Column<int>(nullable: false),
                    Failed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestedCards", x => new { x.CardId, x.TestId });
                    table.ForeignKey(
                        name: "FK_TestedCards_Card_CardId",
                        column: x => x.CardId,
                        principalTable: "Card",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestedCards_Test_TestId",
                        column: x => x.TestId,
                        principalTable: "Test",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TestedCards_TestId",
                table: "TestedCards",
                column: "TestId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TestedCards");

            migrationBuilder.CreateTable(
                name: "FailedCard",
                columns: table => new
                {
                    CardId = table.Column<int>(type: "int", nullable: false),
                    TestId = table.Column<int>(type: "int", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "SuccessCard",
                columns: table => new
                {
                    CardId = table.Column<int>(type: "int", nullable: false),
                    TestId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuccessCard", x => new { x.CardId, x.TestId });
                    table.ForeignKey(
                        name: "FK_SuccessCard_Card_CardId",
                        column: x => x.CardId,
                        principalTable: "Card",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SuccessCard_Test_TestId",
                        column: x => x.TestId,
                        principalTable: "Test",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FailedCard_TestId",
                table: "FailedCard",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_SuccessCard_TestId",
                table: "SuccessCard",
                column: "TestId");
        }
    }
}
