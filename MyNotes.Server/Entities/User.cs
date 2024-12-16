using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MyNotes.Server.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [BsonElement("username")]
        public string Username { get; set; } = null!;

        [BsonElement("firstname")]
        public string Firstname { get; set; } = null!;

        [BsonElement("secondname")]
        public string Secondname { get; set; } = null!;

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}
