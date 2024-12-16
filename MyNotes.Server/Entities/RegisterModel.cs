using System.ComponentModel.DataAnnotations;

namespace MyNotes.Server.Entities
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = null!;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Firstname is required.")]
        [MinLength(2, ErrorMessage = "Firstname must be at least 2 characters long.")]
        public string Firstname { get; set; } = null!;

        [Required(ErrorMessage = "Secondname is required.")]
        [MinLength(2, ErrorMessage = "Secondname must be at least 2 characters long.")]
        public string Secondname { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Password confirmation is required.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
