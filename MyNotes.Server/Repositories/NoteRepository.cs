using MongoDB.Bson;
using MongoDB.Driver;
using MyNotes.Server.Data;
using MyNotes.Server.DTO;
using MyNotes.Server.Entities;

namespace MyNotes.Server.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private readonly IMongoCollection<Note> _notes;

        public NoteRepository(MongoDbService dbService)
        {
            _notes = dbService.Notes;
        }

        //public async Task<List<Note>> GetNotesByUserIdAsync(string userId)
        //{
        //    return await _notes.Find(note => note.UserId == userId).ToListAsync();
        //}

        public async Task CreateNoteAsync(Note note)
        {
            await _notes.InsertOneAsync(note);
        }

        //public async Task<List<Note>> GetAllAsync()
        //{
        //    return await _notes.Find(note => true).ToListAsync();
        //}

        public async Task<bool> UpdateNoteAsync(string id, NoteDto noteDto)
        {
            var filter = Builders<Note>.Filter.Eq(n => n.Id, id);
            var update = Builders<Note>.Update
                .Set(n => n.Title, noteDto.Title)
                .Set(n => n.Content, noteDto.Content)
                .Set(n => n.UpdatedAt, DateTime.UtcNow);

            var result = await _notes.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteNoteAsync(string id)
        {
            var result = await _notes.DeleteOneAsync(n => n.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<Note>> FindByTitleAsync(string title)
        {
            var filter = Builders<Note>.Filter.Regex(n => n.Title, new BsonRegularExpression(title, "i"));
            return await _notes.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<Note>> SortNotesAsync(string sortBy)
        {
            SortDefinition<Note> sortDefinition;

            if (sortBy.ToLower().Contains("datetime"))
            {
                sortDefinition = sortBy.ToLower().EndsWith("asc") ?
                    Builders<Note>.Sort.Ascending(n => n.CreatedAt) :
                    Builders<Note>.Sort.Descending(n => n.CreatedAt);
            }
            else if (sortBy.ToLower().Contains("title"))
            {
                sortDefinition = sortBy.ToLower().EndsWith("asc") ?
                    Builders<Note>.Sort.Ascending(n => n.Title) :
                    Builders<Note>.Sort.Descending(n => n.Title);
            }
            else
            {
                // Default sorting by title ascending
                sortDefinition = Builders<Note>.Sort.Ascending(n => n.Title);
            }

            return await _notes.Find(_ => true).Sort(sortDefinition).ToListAsync();
        }

        public async Task<IEnumerable<Note>> GetAllNotesAsync()
        {
            return await _notes.Find(_ => true).ToListAsync();
        }
    }
}
