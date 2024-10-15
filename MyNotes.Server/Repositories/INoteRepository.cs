using MyNotes.Server.DTO;
using MyNotes.Server.Entities;

namespace MyNotes.Server.Repositories
{
    public interface INoteRepository
    {
        Task CreateNoteAsync(Note note);
        //Task<List<Note>> GetAllAsync();
        //Task<List<Note>> GetNotesByUserIdAsync(string userId);
        Task<bool> UpdateNoteAsync(string id, NoteDto noteDto);
        Task<bool> DeleteNoteAsync(string id);
        Task<IEnumerable<Note>> FindByTitleAsync(string title);
        Task<IEnumerable<Note>> SortNotesAsync(string sortBy);
        Task<IEnumerable<Note>> GetAllNotesAsync();
    }
}