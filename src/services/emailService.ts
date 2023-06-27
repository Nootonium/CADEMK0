import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import { logger } from "../logger";
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function sendEmail({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}): Promise<boolean> {
    try {
        await resend.sendEmail({
            from: fromEmail,
            to: to,
            subject: subject,
            html: body,
        });
        return true;
    } catch (error) {
        logger.error("Error sending email:", error);
        return false;
    }
}

export function buildEmailBody({ name, response }: { name: string; response: string }) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f6f6f6;
            }
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-header {
                text-align: left;
                padding: 20px 20px;
                background-color: #1a1a1a;
                color: #fff;
            }
            .email-content {
                background-color: #fff;
                padding: 20px;
                line-height: 1.5;
            }
            .email-footer {
                text-align: center;
                padding: 20px 0;
                background-color: #1a1a1a;
                color: #fff;
            }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h2>Noot Noot!, ${name}</h2>
                </div>
                <div class="email-content">
                    <p>I love that you've taken the time to dive into my portfolio and reach out.</p>
                    <p>${response}</p>
                    <p>Best regards,</p>
                    <p>Daniel</p>
                    <p>You can reach me at ${fromEmail}</p>
                </div>
            </div>
        </body>
    </html>`;
}
