import { Resend } from 'resend';

const resendApiKey = import.meta.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — contact email not sent');
    return;
  }
  await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.com',
    to: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.com',
    subject: `New contact form submission from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  });
}

export async function sendNewsletterWelcome(email: string): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — newsletter welcome email not sent');
    return;
  }
  await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.com',
    to: email,
    subject: 'Welcome to Gather Ground!',
    text: "Thanks for subscribing to the Gather Ground newsletter. We'll keep you updated with farm news, recipes, and seasonal produce.",
  });
}

export default null;
