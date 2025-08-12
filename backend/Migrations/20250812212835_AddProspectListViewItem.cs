using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quark.Migrations
{
    /// <inheritdoc />
    public partial class AddProspectListViewItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProspectListViewItem",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProspectListViewItem", x => new { x.Id, x.TeamId });
                    table.ForeignKey(
                        name: "FK_ProspectListViewItem_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProspectListViewItem_TeamId",
                table: "ProspectListViewItem",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProspectListViewItem");
        }
    }
}
