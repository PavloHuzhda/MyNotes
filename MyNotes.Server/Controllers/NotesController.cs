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
        public async Task<IActionResult> GetAllNotes()
        {
            var notes = await _noteRepository.GetAllNotesAsync();
            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote(NoteDto noteDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (string.IsNullOrEmpty(userId))
            //{
            //    return Unauthorized("UserId is not available or user is not authenticated.");
            //}
            var note = new Note
            {
                Id = ObjectId.GenerateNewId().ToString(), // Generate a new ID for the note
                Title = noteDto.Title,
                Content = noteDto.Content,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                //UserId = userId // Assign a UserId based on authentication, or from the noteDto if it is included
            };

            await _noteRepository.CreateNoteAsync(note);
            //var userNotes = await _noteRepository.GetNotesByUserIdAsync(note.UserId);
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
