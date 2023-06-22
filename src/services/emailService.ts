import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}) {
    return await resend.sendEmail({
        from: "onboarding@resend.dev",
        to: to,
        subject: subject,
        html: body,
    });
}

export function buildEmailBody({ name, response }: { name: string; response: string }) {
    return `<h1>Hello, ${name}</h1><p>${response}</p>`;
}
