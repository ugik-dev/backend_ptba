import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/roleController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/permission/:id', authMiddleware, controller.getRolePermission);
router.get('/', authMiddleware, controller.getRoles);
router.post('/', authMiddleware, controller.validateCreate, controller.createRole);
router.put('/:id', authMiddleware, controller.updateRole);
router.delete('/:id', authMiddleware, controller.deleteRole);

export default router;
