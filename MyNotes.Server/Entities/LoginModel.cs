using System.ComponentModel.DataAnnotations;

namespace MyNotes.Server.Entities
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email or username is required.")]
        public string Identifier { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = null!;
    }
}
