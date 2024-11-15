using MongoDB.Driver;
using MyNotes.Server.Entities;

namespace MyNotes.Server.Data
{
    public class MongoDbService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _database;

        public MongoDbService(IConfiguration configuration)
        {
            _configuration = configuration;

            var connectionString = _configuration.GetConnectionString("DbConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException(nameof(connectionString), "Database connection string cannot be null or empty.");
            }
            var databaseName = _configuration.GetConnectionString("DatabaseName");
            if (string.IsNullOrEmpty(databaseName))
            {
                throw new ArgumentNullException(nameof(databaseName), "Database name cannot be null or empty.");
            }

            var mongoUrl = MongoUrl.Create(connectionString);

            // Create MongoClientSettings to properly configure connection to Amazon DocumentDB            
            var settings = MongoClientSettings.FromUrl(mongoUrl);

            // Enable SSL/TLS settings for Amazon DocumentDB
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(60);
            settings.UseTls = true;
            settings.AllowInsecureTls = true;  // Allows hostname mismatch since we're using localhost for tunneling
            settings.SslSettings = new SslSettings
            {
                CheckCertificateRevocation = false // This prevents issues if the certificate revocation check fails
            };

            // Disable retryable writes, as they are not supported in Amazon DocumentDB
            settings.RetryWrites = false;

            // Create MongoClient with the updated settings
            var mongoClient = new MongoClient(settings);

            //var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(databaseName);
        }

        public IMongoCollection<Note> Notes => _database.GetCollection<Note>("Notes");
        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        //public IMongoDatabase? Database => _database;
    }
}
