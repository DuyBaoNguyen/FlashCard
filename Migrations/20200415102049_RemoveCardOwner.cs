using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class RemoveCardOwner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Back_User_OwnerId",
                table: "Back");

            migrationBuilder.DropTable(
                name: "CardOwner");

            migrationBuilder.DropIndex(
                name: "IX_Back_OwnerId",
                table: "Back");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "Back");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Back");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "User",
                newName: "Password");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedDate",
                table: "Deck",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "AuthorId",
                table: "Card",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Card",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedDate",
                table: "Card",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Card",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SourceId",
                table: "Card",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedDate",
                table: "Back",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Card_AuthorId",
                table: "Card",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Card_OwnerId",
                table: "Card",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Card_SourceId",
                table: "Card",
                column: "SourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Card_User_AuthorId",
                table: "Card",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Card_User_OwnerId",
                table: "Card",
                column: "OwnerId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Card_Card_SourceId",
                table: "Card",
                column: "SourceId",
                principalTable: "Card",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Card_User_AuthorId",
                table: "Card");

            migrationBuilder.DropForeignKey(
                name: "FK_Card_User_OwnerId",
                table: "Card");

            migrationBuilder.DropForeignKey(
                name: "FK_Card_Card_SourceId",
                table: "Card");

            migrationBuilder.DropIndex(
                name: "IX_Card_AuthorId",
                table: "Card");

            migrationBuilder.DropIndex(
                name: "IX_Card_OwnerId",
                table: "Card");

            migrationBuilder.DropIndex(
                name: "IX_Card_SourceId",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "Deck");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "SourceId",
                table: "Card");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "Back");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "User",
                newName: "PasswordHash");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "Deck",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "Back",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Back",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CardOwner",
                columns: table => new
                {
                    CardId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardOwner", x => new { x.CardId, x.UserId });
                    table.ForeignKey(
                        name: "FK_CardOwner_Card_CardId",
                        column: x => x.CardId,
                        principalTable: "Card",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardOwner_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Back_OwnerId",
                table: "Back",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CardOwner_UserId",
                table: "CardOwner",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Back_User_OwnerId",
                table: "Back",
                column: "OwnerId",
                principalTable: "User",
                principalColumn: "Id");
        }
    }
}
