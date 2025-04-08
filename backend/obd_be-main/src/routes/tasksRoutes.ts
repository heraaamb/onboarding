import express from 'express';
import {getTasks, createTask, deleteTask, updateTaskStatus } from '../controllers/TasksController'
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);
router.patch('/:id', updateTaskStatus);


export default router;