"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmployeeQueriesController_1 = require("../controllers/EmployeeQueriesController");
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';
const router = express_1.default.Router();
router.get('/', EmployeeQueriesController_1.getAllEmployeeQueries);
exports.default = router;
