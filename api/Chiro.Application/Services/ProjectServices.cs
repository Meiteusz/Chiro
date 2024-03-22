﻿using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Domain.Utils;

namespace Chiro.Application.Services
{
    public class ProjectServices : IProjectServices
    {
        private readonly IProjectRepository _repository;

        public ProjectServices(IProjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> CreateProject(CreateProjectDTO createProjectDTO)
        {
            var project = new Domain.Entities.Project
            {
                Name = createProjectDTO.Name,
                Password = Hasher.Encrypt(createProjectDTO.Password),
                Board = new(),
                Timeline = new(),
            };

            return await _repository.CreateProjectAsync(project);
        }

        public async Task<Project> GetProjectAsync(long projectId)
        {
            return await _repository.GetProjectAsync(projectId);
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            return await _repository.GetProjectsAsync();
        }
    }
}