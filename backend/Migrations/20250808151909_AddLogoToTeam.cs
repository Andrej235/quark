using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quark.Migrations
{
    /// <inheritdoc />
    public partial class AddLogoToTeam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "Teams",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_Name",
                table: "Teams",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Teams_Name",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Logo",
                table: "Teams");
        }
    }
}
