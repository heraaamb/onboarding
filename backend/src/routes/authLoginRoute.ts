import express from 'express';
import {checkUserDetails} from '../controllers/authLoginController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.post('/',checkUserDetails)

export default router;