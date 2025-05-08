import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailtype, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

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
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailtype === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        }
        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;
    }
    catch (error: any) {
        throw new Error(error.message || 'Unknown Error')
        console.error('Error sending email:', error);
    }
}

