import bcrypt from 'bcrypt';
import jwt,{JwtPayload} from 'jsonwebtoken'
import pool from '../db/db';
import { GET_USER_BY_ID } from '../queries/users.queries';
import { CHANGE_PASSWORD } from '../queries/authChangePassword.queries';
// import authQueries from '../queries/authChangePassword.queries';

// exports.changePassword = async (userId:any, currentPassword:any, newPassword:any) => {
//   const user = await authQueries.getUserById(userId);
//   if (!user) throw new Error('User not found');

//   const match = await bcrypt.compare(currentPassword, user.password);
//   if (!match) throw new Error('Current password is incorrect');

//   if (currentPassword === newPassword) {
//     throw new Error('New password must be different from current password');
//   }

//   const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//   await authQueries.updatePassword(userId, hashedNewPassword);
// };

export const changePassword = async (authheaders:any, CurrentNewPasswod: any) => {
    // // Debugging
    // console.log(token);
    // console.log(CurrentNewPasswod);

    const token = authheaders.split(' ')[1]
    if (!token) {
        return { message: 'No token provided' };
    }

    const decoded = jwt.decode(token);

    
    if (!decoded || typeof decoded === 'string') {
        return { message: 'Invalid token payload' };
    }

    const user_id = (decoded as JwtPayload).id;
    // // Debugging
    // console.log(user_id);

    const userResult = await pool.query(GET_USER_BY_ID, [user_id])
    const user = userResult.rows[0]
    // // Debugging
    // console.log(user);

    const match = await bcrypt.compare(CurrentNewPasswod.currentPassword, user.password_hash);
    // // Debugging
    // console.log(match);
    if (!match) throw new Error('Current password is incorrect');

    console.log(CurrentNewPasswod.currentPassword);
    console.log(CurrentNewPasswod.newPassword);

    if (CurrentNewPasswod.currentPassword === CurrentNewPasswod.newPassword) {
       throw new Error ('New password must be different from current password');
    }

    const hashedNewPassword = await bcrypt.hash(CurrentNewPasswod.newPassword, 10);
    const result = await pool.query(CHANGE_PASSWORD, [hashedNewPassword, user_id])

    return result
}