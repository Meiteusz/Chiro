using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Chiro.Infra.Migrations
{
    /// <inheritdoc />
    public partial class Regerating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Boards",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Timelines",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Timelines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BoardActions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    PositionY = table.Column<double>(type: "double precision", nullable: false),
                    PositionX = table.Column<double>(type: "double precision", nullable: false),
                    Width = table.Column<double>(type: "double precision", nullable: false),
                    Height = table.Column<double>(type: "double precision", nullable: false),
                    BoardId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BoardActions_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Password = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TimelineId = table.Column<long>(type: "bigint", nullable: false),
                    BoardId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Projects_Timelines_TimelineId",
                        column: x => x.TimelineId,
                        principalTable: "Timelines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimelineActions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AdjustedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConcludedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    BoardActionId = table.Column<long>(type: "bigint", nullable: false),
                    TimelineId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimelineActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimelineActions_BoardActions_BoardActionId",
                        column: x => x.BoardActionId,
                        principalTable: "BoardActions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimelineActions_Timelines_TimelineId",
                        column: x => x.TimelineId,
                        principalTable: "Timelines",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardActions_BoardId",
                table: "BoardActions",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_BoardId",
                table: "Projects",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TimelineId",
                table: "Projects",
                column: "TimelineId");

            migrationBuilder.CreateIndex(
                name: "IX_TimelineActions_BoardActionId",
                table: "TimelineActions",
                column: "BoardActionId");

            migrationBuilder.CreateIndex(
                name: "IX_TimelineActions_TimelineId",
                table: "TimelineActions",
                column: "TimelineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "TimelineActions");

            migrationBuilder.DropTable(
                name: "BoardActions");

            migrationBuilder.DropTable(
                name: "Timelines");

            migrationBuilder.DropTable(
                name: "Boards");
        }
    }
}
