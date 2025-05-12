import express from 'express';
import { getDepartmentsCount } from '../controllers/DepartmentsController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.get('/total-departments', getDepartmentsCount);


export default router;