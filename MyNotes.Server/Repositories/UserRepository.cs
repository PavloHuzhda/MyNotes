using MongoDB.Bson;
using MongoDB.Driver;
using MyNotes.Server.Data;
using MyNotes.Server.Entities;

namespace MyNotes.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(MongoDbService dbService)
        {
            _users = dbService.Users;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _users.Find(user => user.Username == username).FirstOrDefaultAsync();
        }

        public async Task CreateUserAsync(User user)
        {
            //if (string.IsNullOrEmpty(user.Id))
            //{
            //    user.Id = ObjectId.GenerateNewId().ToString(); // Ensure the Id is valid
            //}
            await _users.InsertOneAsync(user);
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return null; // Return null if the id is not a valid ObjectId
            }

            // Use MongoDB's Find method to get the user by their unique Id
            return await _users.Find(user => user.Id == objectId).FirstOrDefaultAsync();
        }
    }
}
