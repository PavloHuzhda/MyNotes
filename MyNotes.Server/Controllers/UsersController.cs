using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyNotes.Server.Entities;
using MyNotes.Server.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyNotes.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;

        public UsersController(IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check for unique email
            var existingUser = await _userRepository.GetUserByEmailAsync(model.Email);
            if (existingUser != null)
                return BadRequest("Email already in use.");

            // Check for unique username
            var existingUserByUsername = await _userRepository.GetUserByUsernameAsync(model.Username);
            if (existingUserByUsername != null)
                return BadRequest("Username already in use.");

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                Firstname = model.Firstname,
                Secondname = model.Secondname,
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);

            await _userRepository.CreateUserAsync(user);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userRepository.GetUserByEmailAsync(model.Identifier) ??
                   await _userRepository.GetUserByUsernameAsync(model.Identifier);
            if (user == null)
                return Unauthorized("Invalid email/username or password.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid email/username or password.");

            // Generate JWT Token
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful",
                token = token
            });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Ensure this matches the user ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("username", user.Username), // Custom claim
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique identifier
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Token expiration
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
