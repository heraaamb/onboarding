import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fundeheramb@gmail.com',
            pass: process.env.EmailPassword // Use environment variables for security!
        }
    });

    await transporter.sendMail({
        // // Enter the senders email
        from: 'fundeheramb@gmail.com',
        to,
        subject,
        text
    });

    console.log(`Email sent to ${to}`);
};
