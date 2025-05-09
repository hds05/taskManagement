import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export const sendEmail = async ({ email, emailtype, userId }: any) => {
    try {
        if (!email || !userId) {
            throw new Error('Missing email or userId');
        }

        // const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        const rawToken = crypto.randomBytes(32).toString('hex'); // generate a random token
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex'); // hash it to store in DB
    

        if (emailtype === 'verify') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if (emailtype === 'reset') {
            await User.findByIdAndUpdate(userId, {
                forgetPasswordToken: hashedToken,
                forgetPasswordTokenExpiry: Date.now() + 3600000
            }
            )
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "0d52383a84167f",
                pass: "eaad1ba34d7df1"
            }
        });

        const mailOptions = {
            from: 'duttsharmahimanshu96@gmail.com',
            to: email,
            subject: emailtype === 'verify' ? 'Verify your email' : 'Reset your password',
            // html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailtype === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}">here</a> to ${emailtype === 'verify' ? 'verify your email' : 'reset your password'} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/${emailtype === 'verify' ? 'verifyemail' : 'resetpassword'}?token=${rawToken}</p>`
        }
        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;
    }
    catch (error: any) {
        console.error('Error sending email:', error);
        throw new Error(error.message || 'Unknown Error')
    }
}

