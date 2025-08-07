using brevo_csharp.Api;
using brevo_csharp.Model;
using Microsoft.AspNetCore.Identity;
using Quark.Exceptions;
using Quark.Models;
using Task = System.Threading.Tasks.Task;

namespace Quark.Services.EmailSender;

public class EmailSender(IConfiguration configuration) : IEmailSender<User>
{
    private readonly TransactionalEmailsApi emailApi = new();
    private readonly string senderEmail =
        configuration["Brevo:SenderEmail"] ?? throw new MissingConfigException("Sender Email");
    private readonly string senderName =
        configuration["Brevo:SenderName"] ?? throw new MissingConfigException("Sender Name");

    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        var subject = "Confirm Your Email";
        var htmlContent =
            $@"<html>
                <body>
                    <h2>Confirm Your Email Address</h2>
                    <p>Please click the link below to confirm your email address:</p>
                    <a href='{confirmationLink}'>Confirm Email</a>
                </body>
            </html>";

        await SendEmailAsync(email, subject, htmlContent);
    }

    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        var subject = "Password Reset Code";
        var htmlContent =
            $@"<html>
                <body>
                    <h2>Reset Your Password</h2>
                    <p>Your password reset code is: <strong>{resetCode}</strong></p>
                    <p>Use this code to reset your password. This code will expire soon.</p>
                </body>
            </html>";

        await SendEmailAsync(email, subject, htmlContent);
    }

    public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        var subject = "Reset Your Password";
        var htmlContent =
            $@"<html>
                <body>
                    <h2>Reset Your Password</h2>
                    <p>Please click the link below to reset your password:</p>
                    <a href='{resetLink}'>Reset Password</a>
                </body>
            </html>";

        await SendEmailAsync(email, subject, htmlContent);
    }

    private async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        var sendSmtpEmail = new SendSmtpEmail(
            sender: new SendSmtpEmailSender(senderName, senderEmail),
            to: [new(toEmail)],
            subject: subject,
            htmlContent: htmlContent
        );

        await emailApi.SendTransacEmailAsync(sendSmtpEmail);
    }
}
