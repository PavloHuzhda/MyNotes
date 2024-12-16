using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MyNotes.Server.DTO;
using MyNotes.Server.Entities;
using MyNotes.Server.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MyNotes.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly INoteRepository _noteRepository;

        public NotesController(INoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        private string GetUserIdFromContext()
        {
            if (HttpContext.Items["UserId"] is string userId)
            {
                return userId;
            }
            throw new UnauthorizedAccessException("User ID not found.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotes(int pageNumber = 1, int pageSize = 3)
        {
            var userId = GetUserIdFromContext();

            var (notes, totalNotes) = await _noteRepository.GetAllNotesAsync(userId, pageNumber, pageSize);
            
            return Ok(new
            {
                notes,
                totalCount = totalNotes,
                currentPage = pageNumber,
                pageSize = pageSize
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] NoteDto noteDto)
        {
            var userId = GetUserIdFromContext();

            var note = new Note
            {
                Title = noteDto.Title,
                Content = noteDto.Content,
                UserId = userId
            };

            await _noteRepository.CreateNoteAsync(note);
            return Ok(new { message = "Note created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNoteAsync(string id, [FromBody] NoteDto noteDto)
        {
            var userId = GetUserIdFromContext();

            // Validate that the note belongs to the user
            var note = await _noteRepository.GetNoteByIdAsync(id);
            if (note == null || note.UserId != userId)
            {
                return Forbid("You are not authorized to update this note.");
            }

            var result = await _noteRepository.UpdateNoteAsync(id, noteDto);
            if (!result)
            {
                return NotFound("Note could not be updated.");
            }

            return Ok(new { message = "Note updated successfully" });            
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoteAsync(string id)
        {
            var userId = GetUserIdFromContext();

            // Validate that the note belongs to the user
            var note = await _noteRepository.GetNoteByIdAsync(id);
            if (note == null) return NotFound("Note not found.");
            if (note.UserId != userId) return Forbid("You are not authorized to delete this note.");

            // Proceed to delete the note
            var result = await _noteRepository.DeleteNoteAsync(id);
            if (!result) return NotFound("Note could not be deleted.");

            // Fetch updated notes for the user
            var (allNotes, totalNotes) = await _noteRepository.GetAllNotesAsync(userId);
            return Ok(new { message = "Note deleted successfully" });
        }

        [HttpGet("search")]
        public async Task<IActionResult> FindByTitleAsync(string title)
        {
            var userId = GetUserIdFromContext();

            var notes = await _noteRepository.FindByTitleAsync(title);
            return Ok(notes);
        }

        [HttpGet("sort")]
        public async Task<IActionResult> SortNotesAsync(string sortBy)
        {
            var userId = GetUserIdFromContext();

            var notes = await _noteRepository.SortNotesAsync(sortBy);
            return Ok(notes);
        }
    }
}
