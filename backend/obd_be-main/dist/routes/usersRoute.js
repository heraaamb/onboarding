"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsersController_1 = require("../controllers/UsersController");
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';
const router = express_1.default.Router();
router.get('/', UsersController_1.getUsers);
router.post('/', UsersController_1.createUser);
router.put('/:id', UsersController_1.updateUser);
router.delete('/:id', UsersController_1.deleteUser);
// router.get('/', auth, authorize(['Admin', 'Super_Admin']), getUsers);
// router.post('/', auth, authorize(['Admin', 'Super_Admin']), createUser);
// router.put('/:id', auth, authorize(['Admin', 'Super_Admin']), updateUser);
// router.delete('/:id', auth, authorize(['Admin', 'Super_Admin']), deleteUser);
exports.default = router;
