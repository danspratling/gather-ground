/**
 * Server-side helper to send a password reset email via Resend.
 *
 * Consumed by POST /api/commerce/auth/password-reset/request after CL
 * creates the customer_password_reset resource and returns the token.
 */

import { Resend } from 'resend';

const FROM_EMAIL =
  import.meta.env.RESEND_FROM_EMAIL ?? 'noreply@gatherground.co.uk';

const SITE_URL = (() => {
  // Vercel sets VERCEL_URL on preview/production deployments.
  const vercelUrl = import.meta.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return 'http://localhost:4321';
})();

export interface PasswordResetEmailData {
  email: string;
  resetToken: string;
}

export async function sendPasswordResetEmail({
  email,
  resetToken,
}: PasswordResetEmailData): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    // In dev without Resend configured, log the link so you can test locally.
    const resetUrl = `${SITE_URL}/account/reset-password?token=${resetToken}`;
    console.info(`[dev] Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  const resetUrl = `${SITE_URL}/account/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your Gather Ground password',
    html: passwordResetHtml({ resetUrl }),
    text: passwordResetText({ resetUrl }),
  });
}

function passwordResetHtml({ resetUrl }: { resetUrl: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;padding:48px 40px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.08em;">Gather Ground</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#202020;">Reset your password</h1>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#4d4d4d;">
                We received a request to reset the password for your Gather Ground account.
                Click the button below to choose a new password. This link expires shortly.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#3b3b3b;border-radius:999px;padding:14px 28px;">
                    <a href="${resetUrl}" style="color:#f5f5f5;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;color:#808080;line-height:1.6;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 32px;font-size:13px;color:#808080;word-break:break-all;">
                <a href="${resetUrl}" style="color:#808080;">${resetUrl}</a>
              </p>
              <p style="margin:0;font-size:13px;color:#b3b3b3;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password won't change until you click the link above and create a new one.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function passwordResetText({ resetUrl }: { resetUrl: string }): string {
  return `Reset your Gather Ground password

We received a request to reset the password for your account.
Click the link below to choose a new password:

${resetUrl}

This link expires shortly. If you didn't request a password reset, you can safely ignore this email.

— Gather Ground`;
}

export default null;
