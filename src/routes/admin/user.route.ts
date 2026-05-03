import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../../controllers/admin/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
