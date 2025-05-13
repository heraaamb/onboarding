import express from 'express';
import { getAllEmployeeQueries, insertNewQuery, getAllOpenEmployeeQueries, replyToHelpRequest } from '../controllers/EmployeeQueriesController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router()

router.get('/', getAllEmployeeQueries);
router.get('/open', getAllOpenEmployeeQueries);
router.post('/reply', replyToHelpRequest);
router.post('/', insertNewQuery);

export default router;