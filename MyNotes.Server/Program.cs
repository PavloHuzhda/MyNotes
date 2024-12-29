
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using MyNotes.Server.Data;
using MyNotes.Server.Entities;
using MyNotes.Server.Middleware;
using MyNotes.Server.Repositories;
using MyNotes.Server.Services;
using System.Text;


namespace MyNotes.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //var options = new WebApplicationOptions
            //{
            //    ContentRootPath = "/home/ec2-user/MyNotes",
            //    WebRootPath = "/home/ec2-user/MyNotes/wwwroot"
            //};

            //var builder = WebApplication.CreateBuilder(options);

            var builder = WebApplication.CreateBuilder(args);//test

            //builder.WebHost.UseWebRoot(builder.Environment.WebRootPath);

            //builder.Configuration
            //   .SetBasePath(builder.Environment.ContentRootPath)
            //   .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            //   .AddEnvironmentVariables();
            
            builder.Services.AddControllers();            
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSingleton<MongoDbService>();
            
            builder.Services.AddScoped<IMongoDatabase>(sp =>
            {
                var mongoService = sp.GetRequiredService<MongoDbService>();
                return mongoService.GetDatabase();
            });
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<INoteRepository, NoteRepository>();
            builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            builder.Services.AddScoped<IEmailService, EmailService>();



            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder =>
                    {                        
                        builder.AllowAnyOrigin() // URL of your React app
                               .AllowAnyMethod() // Allow GET, POST, PUT, DELETE, etc.
                               .AllowAnyHeader(); // Allow all headers                               
                    });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
                    };
                    options.MapInboundClaims = false;
                });           

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowReactApp");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseMiddleware<UserClaimsMiddleware>();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
