import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/refTaxController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissionMiddleware } from '../middlewares/permissionMiddleware';
const router = express.Router();
const pName = 'manage-sub-tax';
router.get('/', authMiddleware, permissionMiddleware(pName, 'show'), controller.get);
router.post('/', authMiddleware, permissionMiddleware(pName, 'create'), controller.validateCreate, controller.create);
router.put('/:id', authMiddleware, permissionMiddleware(pName, 'update'), controller.update);
router.delete('/:id', authMiddleware, permissionMiddleware(pName, 'delete'), controller.deleteData);

export default router;
