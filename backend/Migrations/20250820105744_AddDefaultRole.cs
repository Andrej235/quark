using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quark.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamInvitations",
                table: "TeamInvitations");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "TeamInvitations");

            migrationBuilder.AddColumn<Guid>(
                name: "DefaultRoleId",
                table: "Teams",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "TeamInvitations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamInvitations",
                table: "TeamInvitations",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_DefaultRoleId",
                table: "Teams",
                column: "DefaultRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_TeamRoles_DefaultRoleId",
                table: "Teams",
                column: "DefaultRoleId",
                principalTable: "TeamRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_TeamRoles_DefaultRoleId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_DefaultRoleId",
                table: "Teams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamInvitations",
                table: "TeamInvitations");

            migrationBuilder.DropColumn(
                name: "DefaultRoleId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "TeamInvitations");

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "TeamInvitations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamInvitations",
                table: "TeamInvitations",
                column: "Token");
        }
    }
}
