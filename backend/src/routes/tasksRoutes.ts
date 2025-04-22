import express from 'express';
import {getTasks, getEmployeeSpecificTasks, createTask, deleteTask, updateTaskStatus, editTask } from '../controllers/TasksController'
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getTasks);
router.get('/:id', getEmployeeSpecificTasks); // Assuming you want to get a specific task by ID
router.post('/', createTask);
router.delete('/:id', deleteTask);
router.patch('/:id', updateTaskStatus);
router.put('/:id', editTask)


export default router;