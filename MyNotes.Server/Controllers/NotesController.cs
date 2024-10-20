using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MyNotes.Server.DTO;
using MyNotes.Server.Entities;
using MyNotes.Server.Repositories;
using System.Security.Claims;

namespace MyNotes.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly INoteRepository _noteRepository;

        public NotesController(INoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotes(int pageNumber = 1, int pageSize = 3)
        {
            var (notes, totalNotes) = await _noteRepository.GetAllNotesAsync(pageNumber, pageSize);

            return Ok(new
            {
                notes,
                totalCount = totalNotes,
                currentPage = pageNumber,
                pageSize = pageSize
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote(NoteDto noteDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var note = new Note
            {
                Id = ObjectId.GenerateNewId().ToString(), // Generate a new ID for the note
                Title = noteDto.Title,
                Content = noteDto.Content,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                
            };

            await _noteRepository.CreateNoteAsync(note);
            
            var allNotes = await _noteRepository.GetAllNotesAsync();
                        
            return Ok(allNotes);            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNoteAsync(string id, [FromBody] NoteDto noteDto)
        {
            var result = await _noteRepository.UpdateNoteAsync(id, noteDto);
            if (result)
            {
                var allNotes = await _noteRepository.GetAllNotesAsync();
                return Ok(allNotes);
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoteAsync(string id)
        {
            var result = await _noteRepository.DeleteNoteAsync(id);
            if (result)
            {
                var allNotes = await _noteRepository.GetAllNotesAsync();
                return Ok(allNotes);
            }
            return NotFound();
        }

        [HttpGet("search")]
        public async Task<IActionResult> FindByTitleAsync(string title)
        {
            var notes = await _noteRepository.FindByTitleAsync(title);
            return Ok(notes);
        }

        [HttpGet("sort")]
        public async Task<IActionResult> SortNotesAsync(string sortBy)
        {
            var notes = await _noteRepository.SortNotesAsync(sortBy);
            return Ok(notes);
        }
    }
}
