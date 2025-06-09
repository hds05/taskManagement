import dotenv from "dotenv";
dotenv.config();

import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import crypto from 'crypto';

interface SendEmailProps {
  email: string;
  emailtype: 'verify' | 'reset';
  userId: string;
}

export const sendEmail = async ({ email, emailtype, userId }: SendEmailProps) => {
  try {
    if (!email || !userId) {
      throw new Error('Missing email or userId');
    }

    // Generate a secure token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Update user with token
    if (emailtype === 'verify') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailtype === 'reset') {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: hashedToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Email transport config
    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '0d52383a84167f',
        pass: 'eaad1ba34d7df1',
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: emailtype === 'verify' ? 'Verify your email' : 'Reset your password',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
              <h2 style="color: #007BFF;">${emailtype === 'verify' ? 'Verify Your Email Address' : 'Reset Your Password'}</h2>
              <p>Hello,</p>
              <p>To ${emailtype === 'verify' ? 'verify your email address' : 'reset your password'}, please click the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a 
                  href="${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}" 
                  style="background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${emailtype === 'verify' ? 'Verify Email' : 'Reset Password'}
                </a>
              </p>
              <p>If the button above does not work, please copy and paste the following link into your web browser:</p>
              <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
                <a href="${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}" target="_blank" rel="noopener noreferrer" style="color: #007BFF;">
                  ${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}
                </a>
              </p>
              <p style="margin-top: 40px; font-size: 12px; color: #999;">
                If you did not request this email, please ignore it.
              </p>
              <hr style="border:none; border-top:1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #999;">
                &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
              </p>
            </div>
            `,
    };

    // Send email
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    const err = error as Error;
    console.error('Error sending email:', err);
    throw new Error(err.message || 'Unknown Error');
  }
};
