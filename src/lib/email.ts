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
    throw new Error('RESEND_API_KEY not set — cannot send contact email');
  }
  await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.co.uk',
    to: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.co.uk',
    replyTo: data.email,
    subject: `New contact form submission from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  });
}

export async function sendNewsletterWelcome(email: string): Promise<void> {
  if (!resend) {
    throw new Error(
      'RESEND_API_KEY not set — cannot send newsletter welcome email'
    );
  }
  await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL ?? 'hello@gatherground.co.uk',
    to: email,
    subject: 'Welcome to Gather Ground!',
    text: "Thanks for subscribing to the Gather Ground newsletter. We'll keep you updated with farm news, recipes, and seasonal produce.",
  });
}

export default null;
