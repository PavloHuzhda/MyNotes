using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MyNotes.Server.Entities
{
    public class Note
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;        

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("content")]
        public string Content { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}
