using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quark.Migrations
{
    /// <inheritdoc />
    public partial class AddProspects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_ProspectLayout_DefaultProspectLayoutId",
                table: "Teams");

            migrationBuilder.CreateTable(
                name: "Prospect",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LayoutId = table.Column<Guid>(type: "uuid", nullable: true),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prospect", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prospect_ProspectLayout_LayoutId",
                        column: x => x.LayoutId,
                        principalTable: "ProspectLayout",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Prospect_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prospect_Teams_TeamId1",
                        column: x => x.TeamId1,
                        principalTable: "Teams",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProspectDataField",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    ProspectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProspectDataField", x => new { x.Id, x.ProspectId });
                    table.ForeignKey(
                        name: "FK_ProspectDataField_Prospect_ProspectId",
                        column: x => x.ProspectId,
                        principalTable: "Prospect",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Prospect_LayoutId",
                table: "Prospect",
                column: "LayoutId");

            migrationBuilder.CreateIndex(
                name: "IX_Prospect_TeamId",
                table: "Prospect",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Prospect_TeamId1",
                table: "Prospect",
                column: "TeamId1");

            migrationBuilder.CreateIndex(
                name: "IX_ProspectDataField_ProspectId",
                table: "ProspectDataField",
                column: "ProspectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_ProspectLayout_DefaultProspectLayoutId",
                table: "Teams",
                column: "DefaultProspectLayoutId",
                principalTable: "ProspectLayout",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_ProspectLayout_DefaultProspectLayoutId",
                table: "Teams");

            migrationBuilder.DropTable(
                name: "ProspectDataField");

            migrationBuilder.DropTable(
                name: "Prospect");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_ProspectLayout_DefaultProspectLayoutId",
                table: "Teams",
                column: "DefaultProspectLayoutId",
                principalTable: "ProspectLayout",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
