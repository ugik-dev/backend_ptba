import express, { Request, Response, NextFunction } from 'express';
import * as controller from '../controllers/refController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/roles', authMiddleware, controller.refRoles);
router.get('/tax', authMiddleware, controller.refTax);
// router.get('/sub-tax', authMiddleware, controller.refSubTax);
router.get('/sub-tax/:parent', authMiddleware, controller.refSubTax);
router.get('/permission', authMiddleware, controller.refPermission);
router.get('/region/', authMiddleware, controller.refRegion);
router.get('/region/:parent', authMiddleware, controller.refSubRegion);
router.get('/region/province', authMiddleware, controller.refProvince);

export default router;
