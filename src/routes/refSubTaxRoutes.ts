import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/refSubTaxController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/', authMiddleware, controller.get);
router.post('/', authMiddleware, controller.validateCreate, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.deleteData);

export default router;
