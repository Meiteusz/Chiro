namespace Chiro.Application.Services
{
    public interface IActionDelayService
    {
        Task DelayActionsByProjectId(long projectId);
    }
}
