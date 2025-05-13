import * as authChangePasswordService from '../services/authChangePasswordservice';
import {Request, Response} from 'express'



export const changePassword = async (req: Request, res: Response) => {
  try {
    // Debugging (optional)
    // console.log(req.body);
    // console.log(req.headers.authorization);

    const result = await authChangePasswordService.changePassword(
      req.headers.authorization,
      req.body
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: `Failed to change password: ${error.message}`, error: error.message });
  }
};