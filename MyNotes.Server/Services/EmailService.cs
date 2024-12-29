using Microsoft.Extensions.Options;
using SendGrid.Helpers.Mail;
using SendGrid;

namespace MyNotes.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _apiKey;
        private readonly string _senderEmail;
        private readonly string _senderName;

        public EmailService(IConfiguration configuration)
        {
            var sendGridSettings = configuration.GetSection("SendGridSettings");
            _apiKey = sendGridSettings["ApiKey"];
            _senderEmail = sendGridSettings["SenderEmail"];
            _senderName = sendGridSettings["SenderName"];
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
        {
                var client = new SendGridClient(_apiKey);
                var from = new EmailAddress(_senderEmail, _senderName);
                var to = new EmailAddress(toEmail);
                var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
                var response = await client.SendEmailAsync(msg);

                if (response.StatusCode != System.Net.HttpStatusCode.OK &&
                    response.StatusCode != System.Net.HttpStatusCode.Accepted)
                {
                    // Handle the error (optional)
                    throw new System.Exception($"Failed to send email: {response.StatusCode}");
                }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email: {ex.Message}");
            throw;
        }
        }
    }
}
