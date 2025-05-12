import express from 'express';
const router = express.Router();
import {changePassword} from '../controllers/authChangePasswordController'
// import authenticate from '../middleware/auth.middleware';

router.post('/change-password', changePassword);
// router.post('/change-password', authenticate, authController.changePassword);

export default router
