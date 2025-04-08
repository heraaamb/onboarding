import express from 'express';
import { getAllEmployeeQueries } from '../controllers/EmployeeQueriesController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router()

router.get('/', getAllEmployeeQueries);

export default router;