namespace Chiro.Application.Interfaces
{
    public interface IActionDelayService
    {
        Task DelayActionsByProjectId(long projectId);
    }
}
