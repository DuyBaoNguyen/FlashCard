using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class Upgrade : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Back_Card_CardId",
                table: "Back");

            migrationBuilder.DropForeignKey(
                name: "FK_Deck_Category_CategoryId",
                table: "Deck");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Proposal");

            migrationBuilder.DropIndex(
                name: "IX_Deck_CategoryId",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "ImageType",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "FromAdmin",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "FromAdmin",
                table: "CardAssignment");

            migrationBuilder.DropColumn(
                name: "FromAdmin",
                table: "Back");

            migrationBuilder.DropColumn(
                name: "ImageType",
                table: "Back");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Back");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "User",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Deck",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Deck",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(400)",
                oldMaxLength: 400,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Front",
                table: "Card",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Back",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Back",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Match",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DateTime = table.Column<DateTime>(nullable: false),
                    TotalTime = table.Column<DateTime>(nullable: false),
                    CompletionTime = table.Column<DateTime>(nullable: false),
                    Score = table.Column<float>(nullable: false),
                    DeckId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Match", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Match_Deck_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Deck",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SharedDeck",
                columns: table => new
                {
                    DeckId = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SharedDeck", x => new { x.DeckId, x.UserId });
                    table.ForeignKey(
                        name: "FK_SharedDeck_Deck_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Deck",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SharedDeck_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchedCard",
                columns: table => new
                {
                    MatchId = table.Column<int>(nullable: false),
                    CardId = table.Column<int>(nullable: false),
                    Failed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchedCard", x => new { x.CardId, x.MatchId });
                    table.ForeignKey(
                        name: "FK_MatchedCard_Card_CardId",
                        column: x => x.CardId,
                        principalTable: "Card",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchedCard_Match_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Match",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Match_DeckId",
                table: "Match",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchedCard_MatchId",
                table: "MatchedCard",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_SharedDeck_UserId",
                table: "SharedDeck",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Back_Card_CardId",
                table: "Back",
                column: "CardId",
                principalTable: "Card",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Back_Card_CardId",
                table: "Back");

            migrationBuilder.DropTable(
                name: "MatchedCard");

            migrationBuilder.DropTable(
                name: "SharedDeck");

            migrationBuilder.DropTable(
                name: "Match");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Back");

            migrationBuilder.AlterColumn<byte[]>(
                name: "Avatar",
                table: "User",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageType",
                table: "User",
                type: "nvarchar(4)",
                maxLength: 4,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Deck",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Deck",
                type: "nvarchar(400)",
                maxLength: 400,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Deck",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "FromAdmin",
                table: "Deck",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Deck",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<bool>(
                name: "FromAdmin",
                table: "CardAssignment",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Front",
                table: "Card",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<byte[]>(
                name: "Image",
                table: "Back",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromAdmin",
                table: "Back",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ImageType",
                table: "Back",
                type: "nvarchar(4)",
                maxLength: 4,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Back",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Proposal",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Action = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Approved = table.Column<bool>(type: "bit", nullable: false),
                    CardId = table.Column<int>(type: "int", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeckId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proposal", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Proposal_Card_CardId",
                        column: x => x.CardId,
                        principalTable: "Card",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Proposal_Deck_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Deck",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Proposal_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Deck_CategoryId",
                table: "Deck",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Proposal_CardId",
                table: "Proposal",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_Proposal_DeckId",
                table: "Proposal",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_Proposal_UserId",
                table: "Proposal",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Back_Card_CardId",
                table: "Back",
                column: "CardId",
                principalTable: "Card",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Deck_Category_CategoryId",
                table: "Deck",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id");
        }
    }
}
