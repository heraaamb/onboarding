import express from 'express';
import { getEmployees, getNumberOfEmployees, getEmployeeById, getOnboardingEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeesByDeptId } from '../controllers/EmployeesController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getEmployees);
router.get('/total-employees', getNumberOfEmployees);
router.get('/:user_id', getEmployeeById);
router.get('/onboarding', getOnboardingEmployees);
router.get('/department/:dept_id', getEmployeesByDeptId);
router.post('/', createEmployee); // (name, email, password_hash, role, department_id, status, designation, joining_date, supervisor_id, document_url)
router.put('/:id', updateEmployee);
// router.patch('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// router.get('/', auth, authorize(['Admin', 'Super_Admin']), getEmployees);
// router.get('/onboarding', auth, authorize(['Admin', 'Super_Admin']), getOnboardingEmployees);
// router.post('/', auth, authorize(['Admin', 'Super_Admin']), createEmployee);
// router.put('/:id', auth, authorize(['Admin', 'Super_Admin']), updateEmployee);
// router.delete('/:id', auth, authorize(['Admin', 'Super_Admin']), deleteEmployee);

export default router;