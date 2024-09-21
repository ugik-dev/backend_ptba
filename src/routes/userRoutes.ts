import express, { Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/', authMiddleware, userController.getUsers);
router.post('/', authMiddleware, userController.validateCreateUser, userController.createUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;
