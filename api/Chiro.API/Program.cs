using Chiro.Application.Interfaces;
using Chiro.Application.Services;
using Chiro.Domain.Interfaces;
using Chiro.Infra;
using Chiro.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<ProjectContext>();
builder.Services.AddTransient<IBoardActionServices, BoardActionService>();
builder.Services.AddTransient<IBoardActionRepository, BoardActionRepository>();
builder.Services.AddTransient<IProjectServices, ProjectServices>();
builder.Services.AddTransient<IProjectRepository, ProjectRepository>();
builder.Services.AddTransient<ITimelineActionService, TimelineActionService>();
builder.Services.AddTransient<ITimelineActionRepository, TimelineActionRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();