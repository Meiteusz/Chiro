using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chiro.Infra.Migrations
{
    /// <inheritdoc />
    public partial class CampoDeleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Projects",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Projects");
        }
    }
}
