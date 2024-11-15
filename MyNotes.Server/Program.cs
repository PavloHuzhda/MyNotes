
using MyNotes.Server.Data;
using MyNotes.Server.Repositories;

namespace MyNotes.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var options = new WebApplicationOptions
            {
                ContentRootPath = "/home/ec2-user/MyNotes",
                WebRootPath = "/home/ec2-user/MyNotes/wwwroot"
            };

            var builder = WebApplication.CreateBuilder(options);

            //var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.UseWebRoot(builder.Environment.WebRootPath);

            //Console.WriteLine("Current Directory: " + Directory.GetCurrentDirectory());

            builder.Configuration
               .SetBasePath(builder.Environment.ContentRootPath)
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .AddEnvironmentVariables();

            //var configuration = builder.Configuration;

            // Print all configuration values to console
            //Console.WriteLine("--- Printing Configuration Settings ---");
            //foreach (var kvp in configuration.AsEnumerable())
            //{
            //Console.WriteLine($"{kvp.Key}: {kvp.Value}");
            //}
            //Console.WriteLine("----------------------------------------");



            builder.Services.AddControllers();            
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSingleton<MongoDbService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<INoteRepository, NoteRepository>();

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


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
