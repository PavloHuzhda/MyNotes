using MyNotes.Server.Entities;

namespace MyNotes.Server.Repositories
{
    public interface IUserRepository
    {
        Task CreateUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByIdAsync(string id);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
    }
}