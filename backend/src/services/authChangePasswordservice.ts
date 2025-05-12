// import bcrypt from 'bcrypt';
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
