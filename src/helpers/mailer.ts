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
console.log("EMAIL DOMAIN:", process.env.DOMAIN);

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
      from: 'duttsharmahimanshu96@gmail.com',
      to: email,
      subject: emailtype === 'verify' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}">here</a> to ${
        emailtype === 'verify' ? 'verify your email' : 'reset your password'
      } or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}</p>`,
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
