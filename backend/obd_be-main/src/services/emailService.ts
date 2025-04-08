import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password' // Use environment variables for security!
        }
    });

    await transporter.sendMail({
        // // Enter the senders email
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    });

    console.log(`Email sent to ${to}`);
};
