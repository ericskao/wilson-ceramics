import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

/**
 * Sends an email using Resend.
 * @param to - The recipient's email address
 * @param subject - The subject of the email
 * @param html - The HTML content of the email
 * @returns Response from the Resend API
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const emailResponse = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_EMAIL || '',
      to,
      subject,
      html,
    });
    return emailResponse;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}
