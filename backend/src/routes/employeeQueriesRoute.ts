import express from 'express';
import { getAllEmployeeQueries, insertNewQuery } from '../controllers/EmployeeQueriesController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router()

router.get('/', getAllEmployeeQueries);
router.post('/', insertNewQuery);

export default router;