using Chiro.Infra;

namespace Chiro.Persistence.Tests
{
    public interface IRepositoryTestBase
    {
        ProjectContext CreateInMemoryDatabase();
    }
}
