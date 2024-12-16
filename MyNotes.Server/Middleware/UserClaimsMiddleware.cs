using System.IdentityModel.Tokens.Jwt;

namespace MyNotes.Server.Middleware
{
    public class UserClaimsMiddleware
    {
        private readonly RequestDelegate _next;

        public UserClaimsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity is { IsAuthenticated: true })
            {
                // Extract the userId (Sub claim) from the JWT
                var userId = context.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    // Attach the userId to the HttpContext for later use
                    context.Items["UserId"] = userId;
                }
            }

            await _next(context);
        }
    }
}
