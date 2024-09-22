import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/roleController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissionMiddleware } from '../middlewares/permissionMiddleware';
const router = express.Router();
const pName = 'manage-role';
router.get('/permission/:id', authMiddleware, controller.getRolePermission);
router.get('/', authMiddleware, permissionMiddleware(pName, 'show'), controller.getRoles);
router.post('/', authMiddleware, permissionMiddleware(pName, 'show'), controller.validateCreate, controller.createRole);
router.put('/:id', authMiddleware, permissionMiddleware(pName, 'show'), controller.updateRole);
router.delete('/:id', authMiddleware, permissionMiddleware(pName, 'show'), controller.deleteRole);

export default router;
