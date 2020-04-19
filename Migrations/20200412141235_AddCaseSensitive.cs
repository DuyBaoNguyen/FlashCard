using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashCard.Migrations
{
    public partial class AddCaseSensitive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql("ALTER TABLE Deck ALTER COLUMN Name nvarchar(100) COLLATE SQL_Latin1_General_CP1_CS_AS NOT NULL");
			migrationBuilder.Sql("ALTER TABLE Card ALTER COLUMN Front nvarchar(100) COLLATE SQL_Latin1_General_CP1_CS_AS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
