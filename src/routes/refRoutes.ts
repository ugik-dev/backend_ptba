import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/refController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/roles', authMiddleware, controller.refRoles);
router.get('/permission', authMiddleware, controller.refPermission);

export default router;
