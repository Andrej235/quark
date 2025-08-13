using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quark.Migrations
{
    /// <inheritdoc />
    public partial class AddProspectLayout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DefaultProspectLayoutId",
                table: "Teams",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "ProspectLayout",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JsonStructure = table.Column<JsonDocument>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProspectLayout", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Teams_DefaultProspectLayoutId",
                table: "Teams",
                column: "DefaultProspectLayoutId");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_ProspectLayout_DefaultProspectLayoutId",
                table: "Teams",
                column: "DefaultProspectLayoutId",
                principalTable: "ProspectLayout",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_ProspectLayout_DefaultProspectLayoutId",
                table: "Teams");

            migrationBuilder.DropTable(
                name: "ProspectLayout");

            migrationBuilder.DropIndex(
                name: "IX_Teams_DefaultProspectLayoutId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "DefaultProspectLayoutId",
                table: "Teams");
        }
    }
}
