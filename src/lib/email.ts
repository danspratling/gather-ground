import { Resend } from 'resend';

const resendApiKey = import.meta.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!resend) {
    throw new Error('RESEND_API_KEY not set — cannot send contact email');
  }
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const phoneLine = data.phone ? `\nPhone: ${data.phone}` : '';
  await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.co.uk',
    to: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.co.uk',
    replyTo: data.email,
    subject: `New contact form submission from ${fullName}`,
    text: `Name: ${fullName}\nEmail: ${data.email}${phoneLine}\n\nMessage:\n${data.message}`,
  });
}

export default null;
