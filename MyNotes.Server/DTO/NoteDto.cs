namespace MyNotes.Server.DTO
{
    public class NoteDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
    }
}
