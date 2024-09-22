import express, { Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissionMiddleware } from '../middlewares/permissionMiddleware';
const router = express.Router();
const pName = 'manage-user';
router.get('/', authMiddleware, permissionMiddleware(pName, 'show'), userController.getUsers);
router.post('/', authMiddleware, permissionMiddleware(pName, 'create'), userController.validateCreateUser, userController.createUser);
router.put('/:id', authMiddleware, permissionMiddleware(pName, 'update'), userController.updateUser);
router.delete('/:id', authMiddleware, permissionMiddleware(pName, 'delete'), userController.deleteUser);

export default router;
