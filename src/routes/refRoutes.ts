import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/refController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/roles', authMiddleware, controller.refRoles);
router.get('/tax', authMiddleware, controller.refTax);
router.get('/sub-tax', authMiddleware, controller.refSubTax);
router.get('/permission', authMiddleware, controller.refPermission);

export default router;
