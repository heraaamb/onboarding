import express from 'express';
import {getTasks, getTasksCount, getEmployeeSpecificTasks, createTask, deleteTask, updateTaskStatus, editTask, getDepartmentTasks} from '../controllers/TasksController'
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getTasks);
router.get('/total-tasks', getTasksCount);
router.get('/:id', getEmployeeSpecificTasks); // Assuming you want to get a specific task by ID
router.get('/department/:id', getDepartmentTasks); // Assuming you want to get a specific task by ID
router.post('/', createTask);
router.delete('/:id', deleteTask);
router.patch('/:id', updateTaskStatus);
router.put('/:id', editTask)


export default router;