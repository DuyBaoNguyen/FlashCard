using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddSuccessCard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCards",
                table: "Test");

            migrationBuilder.CreateTable(
                name: "SuccessCard",
                columns: table => new
                {
                    TestId = table.Column<int>(nullable: false),
                    CardId = table.Column<int>(nullable: false)
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
                name: "IX_SuccessCard_TestId",
                table: "SuccessCard",
                column: "TestId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SuccessCard");

            migrationBuilder.AddColumn<int>(
                name: "TotalCards",
                table: "Test",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
