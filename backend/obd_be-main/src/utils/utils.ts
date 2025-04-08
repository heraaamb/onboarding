import crypto from 'crypto';
import { sendEmail } from '../services/emailService'; // A function to send emails
import bcrypt from 'bcrypt';

const port = 4200
export const comp = `https://172.16.90.127:${port}`

export async function generatePassword(){
    // Generate a secure random password
    const plainPassword = crypto.randomBytes(8).toString('hex'); // Example: "f3a9b4c1e8d2"
    return plainPassword
}

export async function hashPassword(plainPassword: string | Buffer<ArrayBufferLike>){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword
}

export async function sendmail(name: any, email: any, plainPassword: any){
          // Send the generated password to the user's email
      const emailSubject = 'Your Account Credentials';
      const emailBody = `
          Hello ${name},

          Your account has been created successfully.
          Here are your login details:

          Email: ${email}
          Temporary Password: ${plainPassword}

          Please change your password upon first login.

          Regards,
          Your Company
      `;
      await sendEmail(email, emailSubject, emailBody);
}