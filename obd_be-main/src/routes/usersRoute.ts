import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/UsersController';
// import auth from '../middleware/auth';
// import authorize from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// router.get('/', auth, authorize(['Admin', 'Super_Admin']), getUsers);
// router.post('/', auth, authorize(['Admin', 'Super_Admin']), createUser);
// router.put('/:id', auth, authorize(['Admin', 'Super_Admin']), updateUser);
// router.delete('/:id', auth, authorize(['Admin', 'Super_Admin']), deleteUser);

export default router;