"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmployeesController_1 = require("../controllers/EmployeesController");
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';
const router = express_1.default.Router();
router.get('/', EmployeesController_1.getEmployees);
router.get('/onboarding', EmployeesController_1.getOnboardingEmployees);
router.post('/', EmployeesController_1.createEmployee); // (name, email, password_hash, role, department_id, status, designation, joining_date, supervisor_id, document_url)
// router.put('/:id', updateEmployee);
router.patch('/:id', EmployeesController_1.updateEmployee);
router.delete('/:id', EmployeesController_1.deleteEmployee);
// router.get('/', auth, authorize(['Admin', 'Super_Admin']), getEmployees);
// router.get('/onboarding', auth, authorize(['Admin', 'Super_Admin']), getOnboardingEmployees);
// router.post('/', auth, authorize(['Admin', 'Super_Admin']), createEmployee);
// router.put('/:id', auth, authorize(['Admin', 'Super_Admin']), updateEmployee);
// router.delete('/:id', auth, authorize(['Admin', 'Super_Admin']), deleteEmployee);
exports.default = router;
