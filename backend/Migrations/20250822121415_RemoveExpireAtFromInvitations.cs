using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quark.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExpireAtFromInvitations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExpiresAt",
                table: "TeamInvitations",
                newName: "CreatedAt"
            );

            migrationBuilder.RenameIndex(
                name: "IX_TeamInvitations_ReceiverId_ExpiresAt",
                table: "TeamInvitations",
                newName: "IX_TeamInvitations_ReceiverId_CreatedAt"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "TeamInvitations",
                newName: "ExpiresAt"
            );

            migrationBuilder.RenameIndex(
                name: "IX_TeamInvitations_ReceiverId_CreatedAt",
                table: "TeamInvitations",
                newName: "IX_TeamInvitations_ReceiverId_ExpiresAt"
            );
        }
    }
}
