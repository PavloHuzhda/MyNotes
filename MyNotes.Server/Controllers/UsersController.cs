using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyNotes.Server.DTO;
using MyNotes.Server.Entities;
using MyNotes.Server.Repositories;
using MyNotes.Server.Services;
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
        public readonly IEmailService _emailService;

        public UsersController(IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IConfiguration configuration, IEmailService emailService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
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
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            // 1. Validate input
            if (string.IsNullOrEmpty(model.Email))
                return BadRequest("Email is required.");

            // 2. Find the user by email
            var user = await _userRepository.GetUserByEmailAsync(model.Email);
            if (user == null)
                return NotFound("User with this email does not exist.");

            // 3. Generate a password reset token (JWT with short expiry)
            var token = GeneratePasswordResetToken(user.Id.ToString());

            // 4. Send email with reset link (update the link for your frontend)
            var resetLink = $"{_configuration["FrontendUrl"]}/reset-password?token={token}";
            await _emailService.SendEmailAsync(model.Email, "Password Reset Request",
                $"Click <a href='{resetLink}'>here</a> to reset your password.");

            return Ok(new { message = "Password reset link has been sent to your email." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {

            if (string.IsNullOrEmpty(model.Token) || string.IsNullOrEmpty(model.NewPassword))
                return BadRequest("Invalid request.");

            var principal = ValidatePasswordResetToken(model.Token);
            if (principal == null)
            {
                return BadRequest("Invalid or expired token.");
            }

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Invalid token.");
            }

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.PasswordHash = _passwordHasher.HashPassword(user, model.NewPassword);
            await _userRepository.UpdateUserAsync(user);

            return Ok(new { message = "Password has been reset successfully." });
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

        private string GeneratePasswordResetToken(string userId)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Token valid for 15 minutes
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private ClaimsPrincipal ValidatePasswordResetToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                ValidateLifetime = false,
                ClockSkew = TimeSpan.Zero
            };
            

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                if (validatedToken is JwtSecurityToken jwtToken &&
                    jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return principal;
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }

            //try
            //{
            //    return tokenHandler.ValidateToken(token, validationParameters, out _);
            //}
            //catch
            //{
            //    return null; // Token is invalid
            //}
        }
    }
}
