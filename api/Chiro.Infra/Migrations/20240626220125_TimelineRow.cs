using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chiro.Infra.Migrations
{
    /// <inheritdoc />
    public partial class TimelineRow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TimelineRow",
                table: "BoardActions",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimelineRow",
                table: "BoardActions");
        }
    }
}
