using MongoDB.Bson;
using MongoDB.Driver;
using MyNotes.Server.Data;
using MyNotes.Server.Entities;

namespace MyNotes.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");

            // Create an index for unique username
            var indexOptions = new CreateIndexOptions { Unique = true };
            var indexKeys = Builders<User>.IndexKeys.Ascending(u => u.Username);
            var indexModel = new CreateIndexModel<User>(indexKeys, indexOptions);
            _users.Indexes.CreateOne(indexModel);
        }

        public async Task CreateUserAsync(User user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _users.InsertOneAsync(user);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _users.Find(u => u.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        public async Task DeleteUserAsync(string id)
        {
            await _users.DeleteOneAsync(u => u.Id == ObjectId.Parse(id));
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }
    }
}
