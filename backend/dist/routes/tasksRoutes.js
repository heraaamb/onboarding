"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TasksController_1 = require("../controllers/TasksController");
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';
const router = express_1.default.Router();
router.get('/', TasksController_1.getTasks);
router.post('/', TasksController_1.createTask);
router.delete('/:id', TasksController_1.deleteTask);
router.patch('/:id', TasksController_1.updateTaskStatus);
router.put('/:id', TasksController_1.editTask);
exports.default = router;
